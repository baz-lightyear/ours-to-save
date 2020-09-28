import React, { Component, useEffect, useMemo, useState, useCallback } from 'react';
import { createEditor, Editor, Transforms, Range, Text } from 'slate'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import { useMutation } from '@apollo/react-hooks';
import { withHistory } from 'slate-history'
import isUrl from 'is-url';
import { CREATE_STORY_MUTATION } from '../components/Apollo';

const TextEditor = () => {
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
            children: [{ text: 'A line of text in a paragraph.' }],
        },
        {
            type: 'paragraph',
            children: [{ text: 'another.' }],
        },
    ])
    const editor = useMemo(
        () => withLinks(withHistory(withReact(createEditor()))),
        []
    )

    const [createStory, { data }] = useMutation(CREATE_STORY_MUTATION);

    const saveToDB = () => {
        const string = JSON.stringify(value)        
        createStory({ variables: { title: "test", content: string, address: "london", morality: "good" } });
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
            <button
                active={isLinkActive(editor)}
                onMouseDown={event => {
                    event.preventDefault()
                    const url = window.prompt('Enter the URL of the link:')
                    if (!url) return
                    insertLink(editor, url)
                }}
            >
                <span>link</span>
            </button>
        )
    }

    return (
        <>
            Are you sneaking around...?
            {/* <Slate 
                editor={editor} 
                value={value} 
                onChange={value => {
                    setValue(value)
                }}
            >
                <div>
                    <LinkButton />
                </div>
                <Editable
                    renderElement={props => <Element {...props} />}
                />
            </Slate>
            
            <button onClick={saveToDB}>clicky here</button> */}
        </>
    )
}

export default TextEditor;