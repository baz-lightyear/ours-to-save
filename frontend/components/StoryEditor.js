import React, { Component, useEffect, useMemo, useState, useCallback } from 'react';
import { createEditor, Editor, Transforms, Range, Text } from 'slate'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import { useMutation } from '@apollo/react-hooks';
import { withHistory } from 'slate-history'
import isUrl from 'is-url';
import styled from 'styled-components';
import { CREATE_STORY_MUTATION, STORIES_QUERY } from './Apollo';

const Container = styled.div`
    .editable {
        width: 100%;
        min-height: 15rem;
        font-family: ${props => props.theme.serif};
        opacity: 0.5;
        border: none;
        border-bottom: 4px solid ${props => props.theme.green};
        margin-bottom: 1rem;
        background-color: #9fc8ca59;
        padding: 4px;
        &:focus {
            outline: none;
            opacity: 1;
        }
    }
    .linkDiv {
        display: flex;
        justify-content: space-between;
        align-items: center;
        #addLink {
            margin: 0;
            margin-top: 1rem;
            padding: 4px 8px;
            background-color: ${props => props.theme.green};
            color: ${props => props.theme.offWhite};
            opacity: 0.7;
            cursor: pointer;
            &:hover {
                opacity: 1;
                border-color: ${props => props.theme.green};
            }
        }
    }
    .forbidden {
        color: red;
    }
`;

const TextEditor = (props) => {
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
    const [chars, setChars] = useState(0)
    const editor = useMemo(
        () => withLinks(withHistory(withReact(createEditor()))),
        []
    )
    const [createStory, { data }] = useMutation(CREATE_STORY_MUTATION);

    const saveContent = () => {
        const string = JSON.stringify(value)
        props.saveContent(string)
    }
    const countChars = (value) => {
        let count = 0
        value.forEach(element => {
            element.children.forEach(child => {
                if (child.type === "link") {
                    count += child.children[0].text.length
                } else {
                    count += child.text.length
                }
            })
        })
        props.setChars(count)
        setChars(count)
    }

    const Element = ({ attributes, children, element }) => {
        switch (element.type) {
            case 'link':
                return (
                    <a {...attributes} href={element.url}>
                        {children}
                    </a>
                )
            default:
                return <p {...attributes}>{children}</p>
        }
    }

    const LinkButton = () => {
        const editor = useSlate()
        return (
            <div className="linkDiv">
                <button
                    id="addLink"
                    active={isLinkActive(editor)}
                    onClick={event => {
                        event.preventDefault()
                        const url = window.prompt('Enter the URL of the link:')
                        if (!url) return
                        insertLink(editor, url)
                    }}
                >
                    add link
                </button>
                <span className={chars > 300 ? "forbidden" : ""}>Characters remaining: {300 - chars}</span>
            </div>
        )
    }

    return (
        <Container>
            <Slate 
                editor={editor} 
                value={value} 
                onChange={value => {
                    countChars(value)
                    setValue(value)
                    saveContent()
                }}
            >
                <div>
                    <LinkButton />
                </div>
                <Editable
                    className="editable"
                    renderElement={props => <Element {...props} />}
                    placeholder=""
                />
            </Slate>
        </Container>
    )
}

export default TextEditor;