import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import Error from './Error';
import RichtextEditor from './RichtextEditor';

import {CREATE_STORY_MUTATION, MAP_STORIES_QUERY} from './Apollo';
import { optimiseCloudinary } from '../lib/utils'

const Form = styled.form`
    input, textarea {
        width: 100%;
        font-family: ${props => props.theme.serif};
        opacity: 0.5;
        border: solid 1px ${props => props.theme.black};
        margin-bottom: 1rem;
        background-color: ${props => props.theme.offWhite};
        padding-left: 0.5rem;
        &:focus {
            outline: none;
            opacity: 1;
        }
    }
    #title {
        font-size: 1.5rem;
        font-weight: 700;
    }
    #file {
        background-color: transparent;
        font-family: ${props => props.theme.sansSerif};
        border: none;
    }
    #image {
        display: block;
        margin: auto;
        margin-bottom: 1rem;
    }
    #loading {
        display: block;
        margin: auto;
    }
    .submit {
        text-align: center;
        #submit {
            background-color: transparent;
            border: none;
            font-family: ${props => props.theme.sansSerif};
            border: solid 2px ${props => props.theme.green};
            color: ${props => props.theme.green};
            font-weight: 700;
            padding: 0.5rem 1rem;
            margin-bottom: 1rem;
            &:hover {
                border-color: ${props => props.theme.black};
                color: ${props => props.theme.black};
            }
            &:focus {
                outline: none;
            }
        }
    }
    .forbidden {
        color: red;
    }
`;

class CreateStory extends Component {
    state = {
        title: '',
        value: [{type: 'paragraph', children: [{ text: "" }]}],
        address: '',
        author: '',
        image: '',
        loading: false,
        charCount: 0
    };
    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val });
      };
    closeModal = () => {
        this.props.closeModal()
    }
    uploadFile = async e => {
        this.setState({loading: true})
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0])
        data.append('upload_preset', 'ourstosave');
        const res = await fetch('https://api.cloudinary.com/v1_1/bazkingdon/image/upload', {
            method: 'POST',
            body: data,
        });
        const file = await res.json();
        this.setState({
            image: file.secure_url,
            loading: false
        });
    };
    setValue = value => {
        this.setState({value: value})
    }
    setChars = (chars) => {
        this.setState({charCount: chars})
    }
    render() {
        return (
            <Mutation mutation={CREATE_STORY_MUTATION} refetchQueries={[{ query: MAP_STORIES_QUERY }]}>
                {(createStory, { loading, error }) => (
                    <Form
                        data-test="form"
                        onSubmit={async e => {
                            e.preventDefault();
                            const string = JSON.stringify(this.state.value)
                            await createStory({ variables: { 
                                title: this.state.title,
                                content: string,
                                address: this.state.address,
                                author: this.state.author,
                                image: this.state.image,
                            }})
                            Swal.fire({
                                title: 'Thanks for submitting',
                                text: "Once your post is reviewed you'll be able to see it on the map",
                                icon: 'success',
                                confirmButtonColor: '#329094'
                            })
                            this.setState({ title: "", content: "", address: "", author: "", interestedInFeatureEmail: ""})
                            // this.closeModal()
                            Router.push({
                                pathname: '/feed',
                            });
                        }}
                    >
                        <div>
                            <fieldset disabled={loading} aria-busy={loading} >
                                <label htmlFor="title">Summarise what happened<sup>*</sup></label>
                                <br/>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder=""
                                    required
                                    maxLength="100"
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                />
                                <br/>

                                <label htmlFor="content">Share some of the details:<sup>*</sup></label>
                                <br/>
                                <small>It's great if you can refer to a source too. <span className={this.state.charCount > 500 ? "forbidden" : ""}>Characters remaining: {500 - this.state.charCount}</span></small>
                                <br/>
                                <br/>
                                <RichtextEditor 
                                    value={this.state.value} 
                                    setValue={this.setValue}
                                    setChars={this.setChars} 
                                    contentType="story" 
                                />
                                <br/>
                                <label htmlFor="file">
                                    If you like, add a picture.
                                </label>
                                <br/>
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    onChange={this.uploadFile}
                                />
                                {this.state.loading &&  <img src="loading.gif" alt="loading" width="50px" id="loading"/>}
                                {this.state.image && (
                                <img width="100" src={optimiseCloudinary(this.state.image, 400)} alt="Upload Preview" id="image"/>
                                )}
                                <label htmlFor="address">Where did this happen?<sup>*</sup>
                                    <br/>
                                </label>
                                <br/>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder="e.g. Bristol, UK, BS1 1DB"
                                    required
                                    value={this.state.address}
                                    onChange={this.handleChange}
                                />
                                <br/>
                                <label htmlFor="author">
                                    Your name, or attribute where you originally found the story
                                    <br/>
                                    <small>Defaults to "Anonymous"</small>
                                </label>
                                <br/>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    placeholder="Anonymous"
                                    value={this.state.author}
                                    onChange={this.handleChange}
                                />
                                <br/>
                                <div className="submit">
                                    <button style={{cursor: "pointer"}} disabled={this.state.charCount > 500} id="submit" type="submit">submit post</button>
                                    <br/>
                                    <small>By submitting this post I promise that it is true (to the best of my knowledge)</small>
                                </div>
                            </fieldset>
                            <Error error={error} />
                        </div> 
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateStory;
