import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import styled from 'styled-components';
import {CREATE_STORY_MUTATION, STORIES_QUERY} from './Apollo';

const Form = styled.form`
    text-align: left;
    border-bottom: 4px solid ${props => props.theme.green};
    .formTitle {
        background-color: ${props => props.theme.green};
        padding: 0 1rem;
        color: ${props => props.theme.offWhite};
        h3 {
            margin: 0;
        }
    }
    .show {
        height: fit-content;
        transition: all 1s cubic-bezier(0.075,0.82,0.165,1);
        padding: 1rem;
    }
    .hide {
        height: 0px; 
        overflow: hidden;
        padding: 0rem 1rem;
        transition: all 1s cubic-bezier(0.075,0.82,0.165,1);
    }
    fieldset {
        background-color: ${props => props.theme.offWhite};
        margin: 0;
        border: none;
        display: flex;
        flex-direction: column;
        input, textarea {
            border: none;
            border-bottom: solid 2px ${props => props.theme.green};
            background-color: #ffffff;
            opacity: 40%;
            margin-bottom: 1rem;
            width: 100%;
            font-family: ${props => props.theme.serif};
            color: ${props => props.theme.darkgreen};
            &:focus {
                outline: none;
            }
        }
        textarea {
            height: 9rem;
            width: 100%;
        }
        #title {
            font-size: 2rem;
            font-weight: 700;
        }
        #content {
            font-size: 1rem;
        }
        #address {
            font-size: 1rem;
        }
        .flex {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0.5rem 0;
            input {
                width: auto;
                margin: 0 1rem;
                font-size: 2rem;
            }
        }
    }
    .buttons {
        display: flex;
        div {
            margin-top: 1rem;
            border: none;
            background-color: transparent;
            border: solid 2px ${props => props.theme.green};
            color: ${props => props.theme.green};
            font-family: ${props => props.theme.sansSerif};
            text-align: center;
            padding: 0 1rem;
            border-radius: 4px;
            font-size: 1rem;
            margin-right: 1rem;
            &:hover, &.selected {
                border: solid 2px ${props => props.theme.black};
                color: ${props => props.theme.black};
            }
        }
        #goodButton {
            margin-right: 1rem;
        }
        #badButton {
        }
    }
    #submit {
        border: none;
        background-color: transparent;
        border: solid 2px ${props => props.theme.green};
        color: ${props => props.theme.green};
        font-family: ${props => props.theme.sansSerif};
        border-radius: 4px;
        margin: auto;
        margin-top: 1rem;
        padding: 0.5rem 2rem;
        font-size: 1rem;
        font-weight: 700;
        &:hover {
            border: solid 2px ${props => props.theme.black};
            color: ${props => props.theme.black};
        }
    }
`;

class CreateStory extends Component {
    state = {
        title: '',
        content: '',
        address: '',
        good: 'good',
        show: 'hide',
        author: ''
    };
    toggleShow = () => {
        this.state.show === 'show' ? this.setState({show: 'hide'}) : this.setState({show: 'show'});
    }
    good = () => {
        this.setState({good: "good"})
    }
    bad = () => {
        this.setState({good: "bad"})
    }
    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val });
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
                            Router.push({
                                pathname: '/map',
                            });
                            this.setState({ title: "", content: "", address: "", author: ""})
                        }}
                    >
                        <div className="formTitle" onClick={this.toggleShow}>
                            <h3>{this.state.show === "show" ? "-" : "+"} Add a post</h3>
                        </div>
                        <div className={this.state.show}>

                            <fieldset disabled={loading} aria-busy={loading} >
                                <label htmlFor="title">
                                    Think of a snappy title: 
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder=""
                                    required
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                />
                                <label htmlFor="content">
                                    Content of your post: 
                                </label>
                                <textarea
                                    type="text"
                                    id="content"
                                    name="content"
                                    placeholder=""
                                    required
                                    value={this.state.content}
                                    onChange={this.handleChange}
                                ></textarea>
                                <label htmlFor="address">
                                    Where did this happen?
                                </label>
                                <small>(Try to include a postcode if you can - it's easier for us to find it)</small>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder=""
                                    required
                                    value={this.state.address}
                                    onChange={this.handleChange}
                                />
                                <label htmlFor="author">
                                    Your name (default "anonymous")
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    placeholder=""
                                    value={this.state.author}
                                    onChange={this.handleChange}
                                />
                                <label id="good" htmlFor="good">
                                    Is this good news or bad?
                                </label>
                                <div className="buttons">
                                    <div id="goodButton" onClick={this.good} className={this.state.good === "good" ? "selected" : null}>Good</div>
                                    <div id="badButton" onClick={this.bad} className={this.state.good === "good" ? null : "selected"}>Bad</div>
                                </div>
                                <div style={{display: "flex"}}>
                                    <input type="checkbox"/>
                                    <label for="interestedInFeature">check this box if you're interested in submitting a full-length feature article</label>
                                </div>
                                <small>By submitting this post I promise that it is true (to the best of my knoweldge) and respectful (I care about sharing stories, not fighting keyboard wars)</small>
                        
                                <div style={{textAlign: "left"}}>
                                    <button id="submit" type="submit">submit post</button>
                                </div>
                            </fieldset>
                        </div> 
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateStory;
