import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import Error from './Error';

import {CREATE_STORY_MUTATION, STORIES_QUERY} from './Apollo';

const Form = styled.form`
    input, textarea {
        width: 100%;
        font-family: ${props => props.theme.serif};
        opacity: 0.5;
        border: none;
        border-bottom: 4px solid ${props => props.theme.green};
        margin-bottom: 1rem;
        background-color: #9fc8ca59;
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
    textarea {
        height: 15rem;
    }
    .morality {
        display: flex;
        justify-content: space-between;
        div {
            width: 33%;
            cursor: pointer;
            text-align: center;
            padding: 8px;
            height: 6rem;
            display: flex;
            align-items: center;
            background-color: ${props => props.theme.green};
            border-radius: 4px;
            opacity: 0.5;
            margin-bottom: 1rem;
            &.middleMorality {
                margin: 1rem;
            }
            p {
                font-size: 1rem;
                width: 100%;
                margin-bottom: 0;
                color: white;
            }
            &:hover {
                opacity: 0.8;
            }
        }
        .clicked {
            opacity: 1 !important;
        }
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
`;

class CreateStory extends Component {
    state = {
        title: '',
        content: '',
        address: '',
        morality: '',
        author: '',
        interestedInFeatureEmail: '',
        image: '',
        loading: false
    };
    setMoralityGood = () => {
        this.setState({morality: "good"})
    };
    setMoralityBad = () => {
        this.setState({morality: "bad"})
    };
    setMoralityBetween = () => {
        this.setState({morality: "inbetween"})
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
    render() {
        return (
            <Mutation mutation={CREATE_STORY_MUTATION} variables={this.state} refetchQueries={[{ query: STORIES_QUERY }]}>
                {(createStory, { loading, error }) => (
                    <Form
                        data-test="form"
                        onSubmit={async e => {
                            e.preventDefault();
                            await createStory();
                            Swal.fire({
                                title: 'Thanks for submitting',
                                text: "Once your post is reviewed you'll be able to see it on the map",
                                icon: 'success',
                                confirmButtonColor: '#329094'
                            })
                            this.setState({ title: "", content: "", address: "", author: "", morality: "", interestedInFeatureEmail: ""})
                            this.closeModal()
                            Router.push({
                                pathname: '/map',
                            });
                        }}
                    >
                        <div>
                            <fieldset disabled={loading} aria-busy={loading} >
                                <label htmlFor="title">What happened?<super>*</super></label>
                                <br/>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder=""
                                    required
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                />
                                <br/>
                                <label htmlFor="content">Share some of the details:<super>*</super></label>
                                <br/>
                                <textarea
                                    type="text"
                                    id="content"
                                    name="content"
                                    placeholder=""
                                    required
                                    value={this.state.content}
                                    onChange={this.handleChange}
                                ></textarea>
                                <div className="morality">
                                    <div onClick={this.setMoralityGood} className={this.state.morality === "good" ? "clicked" : ""}><p>This is good news</p></div>
                                    <div onClick={this.setMoralityBad} id="middleMorality" className={this.state.morality === "bad" ? "clicked" : ""}><p>This is bad news</p></div>
                                    <div onClick={this.setMoralityBetween} className={this.state.morality === "inbetween" ? "clicked" : ""}><p>This is somewhere in between</p></div>
                                </div>
                                <label htmlFor="file">
                                    If you like, add a picture (you can drag and drop)
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
                                <img width="100" src={this.state.image} alt="Upload Preview" id="image"/>
                                )}
                                <label htmlFor="address">Where did this happen?<super>*</super>
                                    <br/>
                                    <small>Try to include a postcode / zipcode if you can - it's easier for us to find it</small>
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
                                    Your name:
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
                                <label for="interestedInFeatureEmail">Add your email, if you're interested in submitting a full-length feature article</label>
                                <br/>
                                <input
                                    type="text"
                                    id="interestedInFeatureEmail"
                                    name="interestedInFeatureEmail"
                                    placeholder="e.g. florence@ourstosave.com"
                                    value={this.state.interestedInFeatureEmail}
                                    onChange={this.handleChange}
                                />
                                <div className="submit">
                                    <button id="submit" type="submit">submit post</button>
                                    <br/>
                                    <small>By submitting this post I promise that it is true (to the best of my knowledge) and is written in a respectful tone.</small>
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
