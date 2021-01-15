import React, { useMemo, useCallback } from 'react';
import { createEditor, Editor, Transforms, Range, Element as SlateElement } from 'slate'
import { Slate, Editable, withReact, useSlate, useSelected, useFocused } from 'slate-react'
import { withHistory } from 'slate-history'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url';
import styled from 'styled-components';
import Swal from 'sweetalert2';


const Container = styled.div`
    border: solid 1px ${props => props.theme.black};
    border-top: none;
    #formatButtons {
        position: sticky;
        z-index: 2;
        top: 40px;
        border-top: solid 1px ${props => props.theme.black};
        width: 100%;
        background-color: ${props => props.theme.yellow};
        .formatButton {
            margin: 0;
            border: none;
            opacity: 0.7;
            padding: 0;
            &:hover {
                opacity: 1;
            }
            img {
                height: 32px;
                padding: 8px;
            }
        }
    }
    .editable {
        width: 100%;
        min-height: 50vh;
        font-family: ${props => props.theme.serif};
        border-radius: 0px 0px 4px 4px;
        margin-bottom: 1rem;
        padding: 1rem;
        &:focus {
            outline: none;
            opacity: 1;
        }
        blockquote {
            margin: 1rem;
            padding: 0 1rem;
            font-size: 1.5rem;
            border-left: solid 4px ${props => props.theme.green};
            background-color: rgba(52, 144, 148, 0.2)
        }
        .image {
            margin: 1rem;
            max-width: 90%;
        }
    }
`

// One particular function 'IsLinkActive' is used by both the Slate component and a subcomponent, LinkButton, so we have to render it higher than both.
const isLinkActive = editor => {
    const [link] = Editor.nodes(editor, { match: n => n.type === 'link' })
    return !!link
}
const wrapLink = (editor, url) => {
    if (isLinkActive(editor)) {
        Transforms.unwrapNodes(editor, { match: n => n.type === 'link' })
    }    
    const isCollapsed = editor.selection && Range.isCollapsed(editor.selection)

    const link = {
        type: 'link',
        url,
        children: isCollapsed ? [{ text: url }] : [],
    }
    
    if (isCollapsed) {
        Transforms.insertNodes(editor, link)
    } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
    }
    return null
}
const listTypes = ['numbered-list', 'bulleted-list']


// Element, Lead and ImageElement are functional components. They are the building blocks of 'value', the JSON object we are creating which represents rich text

// Element is used to determine whether the item in the rich text JSON is just text, a blockquote, a link or an image
const Element = props => {
    const { attributes, children, element } = props

    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading':
            return <h2 {...attributes}>{children}</h2>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        case 'image':
            return <ImageElement {...props} />
        case 'link':
            return <a {...attributes} href={element.url}>{children}</a>
        default:
            return <p {...attributes}>{children}</p>
    }
}

// Leaf is used to make text bold or italic and inserts a bunch of <span> into the rich text JSON
const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }
    if (leaf.italic) {
      children = <em>{children}</em>
    }
    if (leaf.underline) {
        children = <u>{children}</u>
    }
    return <span {...attributes}>{children}</span>
}

// ImageElement is used to insert images the rich text JSON
const ImageElement = ({ attributes, children, element }) => {
    const selected = useSelected()
    const focused = useFocused()
    return (
      <div {...attributes}>
        <div contentEditable={false}>
          <img
            src={element.url}
            className="image"
          />
        </div>
        {children}
      </div>
    )
}

// Here we have the functional components which are the building blocks of the toolbar. 
// "MarkButton for italic and bold and underline (unused); "BlockButton" for bulletpoints and quotes. Also "LinkButton"
const MarkButton = ({ format, icon }) => {
    const isMarkActive = (editor, format) => {
        const marks = Editor.marks(editor)
        return marks ? marks[format] === true : false
    }
    
    const toggleMark = (editor, format) => {
        const isActive = isMarkActive(editor, format)
        if (isActive) {
            Editor.removeMark(editor, format)
        } else {
            Editor.addMark(editor, format, true)
        }
    }
    const editor = useSlate()
    return (
        <button
            active={isMarkActive(editor, format)}
            onClick={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
            className="formatButton"
        >
            <img src={icon}/>
        </button>
    )
}
    
const LinkButton = ({icon}) => {
    const editor = useSlate()
    return (
        <button
            className="formatButton"
            id="addLink"
            active={isLinkActive(editor)}
            onClick={async event => {
                // we save the highlighted selection early on because the Swal clears it
                const selection = editor.selection
                event.preventDefault()
                const input = await Swal.fire({
                    title: 'Embed a link',
                    input: 'url',
                    inputPlaceholder: "Make sure to include the 'http'.",
                    showCancelButton: true,
                })
                if (!input.value) return
                // And then we feed the highlighted selection back into the editor manually, to be passed on to the wrapLink function
                editor.selection = selection
                if (selection) {
                    wrapLink(editor, input.value)
                }
            }}
        >
            <img src={icon} alt=""/>
        </button>
    )
}

const BlockButton = ({ format, icon }) => {
    const isBlockActive = (editor, format) => {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === format,
        })
        return !!match
    }
    
    const toggleBlock = (editor, format) => {
        const isActive = isBlockActive(editor, format)
        const isList = listTypes.includes(format)

        Transforms.unwrapNodes(editor, {
            match: n =>
            listTypes.includes(
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
            ),
            split: true,
        })
        Transforms.setNodes(editor, {type: isActive ? 'paragraph' : isList ? 'list-item' : format})

        if (!isActive && isList) {
            const block = { type: format, children: [] }
            Transforms.wrapNodes(editor, block)
        }
    }



    const editor = useSlate()
    return (
        <button
            className="formatButton"
            active={isBlockActive(editor, format)}
            onClick={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            <img src={icon} alt=""/>
        </button>
    )
}


const RichtextEditor = props => {
    // Slate config
    const withImages = editor => {
        // disable images on stories by leaving content unchanged
        if (props.contentType === "story") {
            return editor
        } else {
            const insertImage = url => {
                const text = { text: '' }
                const image = { type: 'image', url, children: [text] }
                Transforms.insertNodes(editor, image)
            }
            const isImageUrl = url => {
                if (!url) return false
                if (!isUrl(url)) return false
                const ext = new URL(url).pathname.split('.').pop()
                return imageExtensions.includes(ext)
            }
            const { insertData, isVoid } = editor
            editor.isVoid = element => {
                return element.type === 'image' ? true : isVoid(element)
            }
            editor.insertData = data => {
                const text = data.getData('text/plain')
                const { files } = data
        
                if (files && files.length > 0) {
                    for (const file of files) {
                        const reader = new FileReader()
                        const [mime] = file.type.split('/')
                        if (mime === 'image') {
                            reader.addEventListener('load', () => {
                                const url = reader.result
                                insertImage(url)
                            })
                            reader.readAsDataURL(file)
                        }
                    }
                } else if (isImageUrl(text)) {
                    insertImage(text)
                } else {
                    insertData(data)
                }
            }
            return editor
        }
    }
    const withLinks = editor => {
        const { insertData, insertText, isInline } = editor
        editor.isInline = element => {
            return element.type === 'link' ? true : isInline(element)
        }
        editor.insertText = text => {
            if (text && isUrl(text)) {
                wrapLink(editor, text)
            } else {
                insertText(text)
            }
        }
        editor.insertData = data => {
            const text = data.getData('text/plain')
            if (text && isUrl(text)) {
                wrapLink(editor, text)
            } else {
                insertData(data)
            }
        }
        return editor
    }
    const editor = useMemo(
        () => withImages(withLinks(withHistory(withReact(createEditor())))),
        []
    )
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const renderElement = useCallback(props => <Element {...props} />, [])
    return (
        <Container>
            <Slate 
                editor={editor} 
                value={props.value} 
                onChange={value => {
                    if (props.contentType === "story") {
                        let count = 0
                        value.forEach(element => {
                            element.children.forEach(child => {
                                console.log(child.type)
                                if (child.type === "link" || child.type === "list-item") {
                                    count += child.children[0].text.length
                                } else {
                                    count += child.text.length
                                }
                            })
                        })
                        props.setChars(count)
                    }
                    props.setValue(value)
                }}
            >
                <div id="formatButtons">
                    <MarkButton format="bold" icon="richTextToolbar/bold.png"/>
                    <MarkButton format="italic" icon="richTextToolbar/italic.png"/>
                    <MarkButton format="underline" icon="richTextToolbar/underline.png"/>
                    <LinkButton icon="richTextToolbar/link.png"/>
                    <BlockButton format="numbered-list" icon="richTextToolbar/numberedList.png" />
                    <BlockButton format="bulleted-list" icon="richTextToolbar/bulletedList.png" />
                    {(props.contentType === "story") ||
                        <> 
                            <BlockButton format="heading" icon="richTextToolbar/heading.png" />
                            <BlockButton format="block-quote" icon="richTextToolbar/quote.png" />
                        </> 
                    }
                </div>
                <Editable
                    className="editable"
                    style={props.contentType === "story" && {minHeight: "10rem"}}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Tell the story..."
                />
            </Slate>
        </Container>
    )
}

export default RichtextEditor