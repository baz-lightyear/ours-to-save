import React, { Component, useEffect, useMemo, useState, useCallback } from 'react';
import { createEditor, Editor, Transforms, Range, Text } from 'slate'
import { Slate, Editable, withReact, useSlate, useEditor, useSelected, useFocused } from 'slate-react'
import { useMutation } from '@apollo/react-hooks';
import Router from 'next/router'
import { withHistory } from 'slate-history'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url';
import styled from 'styled-components';
import { CREATE_FEATURE_MUTATION } from '../components/Apollo';
import { deflateData } from '../lib/utils';

const Container = styled.div`
    padding: 1rem 0;
    textarea, input {
        padding: 0.5rem;
        background-color: ${props => props.theme.offWhite};
        width: 100%;
        margin: 1rem auto;
        font-family: ${props => props.theme.serif};
        border-radius: 4px;
        border: solid 1px;
    }
    select {
        margin: 1rem;
        background-color: ${props => props.theme.offWhite};
        border-radius: 4px;
        border: solid 1px;
    }
    #titleInput {
        font-size: 2rem;
        font-weight: bolder;
    }
    #formatButtons {
        position: sticky;
        text-align: center;
        top: 2rem;
        width: 100%;
        border-bottom: solid 1px ${props => props.theme.grey};
        background-color: ${props => props.theme.offWhite};
        .formatButton {
            margin: 1rem;
            margin-left: 0rem;
        }
    }
    .editable {
        width: 100%;
        min-height: 50vh;
        font-family: ${props => props.theme.serif};
        border: solid 1px ${props => props.theme.grey};
        border-radius: 0px 0px 4px 4px;
        border-top: none;
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
    #address {
        min-width: 50%;
        margin: 1rem 0;
    }
`;

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }
    if (leaf.italic) {
      children = <em>{children}</em>
    }
    return <span {...attributes}>{children}</span>
}

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

const Element = props => {
    const { attributes, children, element } = props

    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'image':
            return <ImageElement {...props} />
        case 'link':
            return <a {...attributes} href={element.url}>{children}</a>
        default:
            return <p {...attributes}>{children}</p>
    }
}

const FeatureEditor = (props) => {


    const isLinkActive = editor => {
        const [link] = Editor.nodes(editor, { match: n => n.type === 'link' })
        return !!link
    }
    const insertLink = (editor, url) => {
        if (editor.selection) {
            wrapLink(editor, url)
        }
    }
    const unwrapLink = editor => {
        Transforms.unwrapNodes(editor, { match: n => n.type === 'link' })
    }
    const wrapLink = (editor, url) => {
        if (isLinkActive(editor)) {
            unwrapLink(editor)
        }      
        const { selection } = editor
        const isCollapsed = selection && Range.isCollapsed(selection)
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

    const isImageUrl = url => {
        if (!url) return false
        if (!isUrl(url)) return false
        const ext = new URL(url).pathname.split('.').pop()
        return imageExtensions.includes(ext)
    }

    const withImages = editor => {
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
                            insertImage(editor, url)
                        })
                        reader.readAsDataURL(file)
                    }
                }
            } else if (isImageUrl(text)) {
                insertImage(editor, text)
            } else {
                insertData(data)
            }
        }
        return editor
    }

    const insertImage = (editor, url) => {
        const text = { text: '' }
        const image = { type: 'image', url, children: [text] }
        Transforms.insertNodes(editor, image)
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
    const [value, setValue] = useState([
        {
            type: 'paragraph',
            children: [{ text: "" }],
        },
    ])
    const [address, setAddress] = useState()
    const [title, setTitle] = useState()
    const [subtitle, setSubtitle] = useState()
    const [bio, setBio] = useState()
    const [author, setAuthor] = useState()
    const [category, setCategory] = useState()

    const editor = useMemo(
        () => withImages(withLinks(withHistory(withReact(createEditor())))),
        []
    )

    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const renderElement = useCallback(props => <Element {...props} />, [])


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
      

    const MarkButton = ({ format, icon }) => {
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
            {format}
          </button>
        )
    }
      

    const LinkButton = () => {
        const editor = useSlate()
        return (
            <button
                className="formatButton"
                id="addLink"
                active={isLinkActive(editor)}
                onClick={event => {
                    event.preventDefault()
                    const url = window.prompt('Enter the URL of the link:')
                    if (!url) return
                    insertLink(editor, url)
                }}
            >
                link
            </button>
        )
    }

    const isBlockActive = (editor, format) => {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === format,
        })
        return !!match
    }

    const toggleBlock = (editor, format) => {
        const isActive = isBlockActive(editor, format)
        Transforms.setNodes(editor, {
            type: isActive ? 'paragraph' : format,
        })
    }

    const BlockButton = ({ format, icon }) => {
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
                quote
            </button>
        )
    }

    const [createFeature, { data }] = useMutation(CREATE_FEATURE_MUTATION);


    const uploadToDatabase = () => {
        const string = JSON.stringify(value)
        createFeature({ variables: { content: string, address: address} });
        window.alert('Nice. Check it out in Prisma to see if it worked')
        Router.push({
            pathname: '/',
        });
    }

    const handleTitle = event => {
        setTitle(event.target.value)
    }
    const handleSubtitle = event => {
        setSubtitle(event.target.value)
    }
    const handleAuthor = event => {
        setAuthor(event.target.value)
    }
    const handleBio = event => {
        setBio(event.target.value)
    }
    const handleCategory = event => {
        setCategory(event.target.value)
    }


    const handleAddress = event => {
        setAddress(event.target.value)
    }

    return (
        <Container>
            <form onSubmit={ async e => {
                e.preventDefault();
                const string = JSON.stringify(value)
                await createFeature({ variables: { 
                    title: title,
                    subtitle: subtitle,
                    bio: bio,
                    author: author,
                    category: category,
                    content: string, 
                    address: address,
                }}).catch(err => {
                    console.log(err)
                }).then(() => {
                    window.alert('Nice. Check it out in Prisma to add cover photo and approve it')
                    Router.push({
                        pathname: '/',
                    });
                });
            }}>

                <span><strong>Title</strong></span>
                <input name="title" id="titleInput" type="text" required value={title} onChange={handleTitle}/>
                <span><strong>Subtitle</strong></span>
                <input name="subtitle" type="text" required value={subtitle} onChange={handleSubtitle}/>
                <span><strong>Author</strong></span>
                <input name="author" type="text" required value={author} onChange={handleAuthor}/>
                <span><strong>Bio</strong></span>
                <input name="bio" type="text" required value={bio} onChange={handleBio}/>
                <span><strong>Category</strong></span>
                <select name="category" required value={category} onChange={handleCategory}>
                    <option value="">--Please choose an option--</option>
                    <option value="power">Power</option>
                    <option value="innovation">Innovation</option>
                    <option value="inspiration">Inspiration</option>
                    <option value="conservation">Conservation</option>
                </select>
                <h3>Text editor:</h3>
                <p>When you add an image, you <strong>must not</strong> just copy an image into here. Instead, you <em>copy and paste the url of the image</em>. Otherwise the file is too big and our server can't process it. Visit Cloudinary <a href="https://cloudinary.com/console/c-db68a86aed67bfc082fda25d3ead23" target="_blank">here</a> (opens in new tab).</p>
                <Slate 
                    editor={editor} 
                    value={value} 
                    onChange={value => {
                        setValue(value)
                    }}
                >
                    <div id="formatButtons">
                        <MarkButton format="bold"  />
                        <MarkButton format="italic" />
                        <BlockButton format="block-quote" />
                        <LinkButton/>
                    </div>
                    <Editable
                        className="editable"
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder="write that magic"
                    />
                </Slate>
                <span><strong>Enter address here ideally with postcode</strong></span>

                <div>
                    <input type="text" id="address" placeholder="" value={address} onChange={handleAddress}/>
                </div>
                <p>You still have to approve it and add a cover photo in <a href="https://app.prisma.io/harry-78d82a/services" target="_blank">Prisma</a>! (opens in new tab)</p>
                <button type="submit">Upload to database</button>
            </form>
        </Container>
    )
}

export default FeatureEditor;