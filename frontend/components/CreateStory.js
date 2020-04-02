import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import {CREATE_STORY_MUTATION, STORIES_QUERY} from './Apollo';

class CreateStory extends Component {
    state = {
        title: '',
        content: '',
    };
    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };
    render() {
        return (
            <Mutation mutation={CREATE_STORY_MUTATION} variables={this.state} refetchQueries={[{ query: STORIES_QUERY }]}>
                {(createStory, { loading, error }) => (
                    <form
                        data-test="form"
                        onSubmit={async e => {
                            e.preventDefault();
                            const res = await createStory();
                            Router.push({
                                pathname: '/stories',
                            });
                            this.setState({ title: "", content: ""})
                        }}
                    >
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="title">
                                Title
                                <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Title"
                                required
                                value={this.state.title}
                                onChange={this.handleChange}
                            />
                            </label>

                            <label htmlFor="content">
                                Content
                                <input
                                type="text"
                                id="content"
                                name="content"
                                placeholder="Content"
                                required
                                value={this.state.content}
                                onChange={this.handleChange}
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </form>
                )}
            </Mutation>
        );
    }
}

export default CreateStory;
