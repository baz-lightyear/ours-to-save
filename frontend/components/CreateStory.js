import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import styled from 'styled-components';
import {CREATE_STORY_MUTATION, STORIES_QUERY} from './Apollo';

const Form = styled.form`
    text-align: left;
    .formTitle {
        background-color: ${props => props.theme.darkgreen};
        padding: 0 1rem;
        color: ${props => props.theme.lightgreen};
        p {
            margin: 0;
        }
    }
    fieldset {
        background-color: ${props => props.theme.lightgreen};
        padding: 1rem;
        margin: 0;
        border: none;
        display: flex;
        flex-direction: column;
        input, textarea {
            border: none;
            background-color: #e4efe9;
            /* border-bottom: solid 2px ${props => props.theme.darkgreen}; */
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
        }
        #content {
            font-size: 1rem;
        }
        #address {
            font-size: 1rem;
        }
        #good {
            text-align: center;
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
        justify-content: center;
        div {
            margin: 1rem;
            border: none;
            width: 100px;
            line-height: 2.5;
            font-family: ${props => props.theme.serif};
            font-weight: 700;
            border: solid 2px transparent;
            text-align: center;
        }
        #goodButton {
            background-color: #9cd8bb;
            color: ${props => props.theme.darkgreen};
            &:hover, &.selected {
                border: solid 2px ${props => props.theme.darkgreen};
            }
        }
        #badButton {
            background-color: #f7bcbc;
            color: #900000;
            &:hover, &.selected {
                border: solid 2px #900000;
            }
        }
    }
    #submit {
        border: none;
        background-color: transparent;
        border: solid 2px ${props => props.theme.darkgreen};
        color: ${props => props.theme.darkgreen};
        font-family: ${props => props.theme.sansSerif};
        border-radius: 4px;
        margin: auto;
        padding: 0.5rem 2rem;
        font-size: 1rem;
        font-weight: 700;
        &:hover {
            color: ${props => props.theme.black};
            border-color: ${props => props.theme.black};
        }
    }
`;

class CreateStory extends Component {
    state = {
        title: '',
        content: '',
        address: '',
        good: 'good'
    };
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
                            this.setState({ title: "", content: "", address: ""})
                        }}
                    >
                        <div className="formTitle">
                            <p>Add a post</p>
                        </div>
                        <fieldset disabled={loading} aria-busy={loading}>
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
                            <label id="good" htmlFor="good">
                                Is this good news or bad?
                            </label>
                            <div className="buttons">
                                <div id="goodButton" onClick={this.good} className={this.state.good === "good" ? "selected" : null}>Good</div>
                                <div id="badButton" onClick={this.bad} className={this.state.good === "good" ? null : "selected"}>Bad</div>
                            </div>
                            <button id="submit" type="submit">submit post</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateStory;
