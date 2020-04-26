import React, { Component } from 'react';
import styled from 'styled-components';
import FeatureEditor from '../components/FeatureEditor';

const Container = styled.div`
    margin: auto;
    width: 95%;
    max-width: 800px;
    .hide {
        display: none;
    }
    .show {
        display: block;
    }
`;

class editor extends Component {
    state = {
        password: '',
        open: false
    }
    handleChange = event => {
        this.setState({password: event.target.value})
    }
    checkPassword = () => {
        if (this.state.password === "soletssaveit") {
            window.alert('Welcome')
            this.setState({open: true})
        } else {
            setTimeout(() => window.alert('Not quite right'), 3000)
        }
    }
    render() {
        return (
            <Container>
                <div className={`password ${this.state.open ? "hide" : "show"}`}>
                    <h4>Are you in the right place?</h4>
                    <p>Enter the password:</p>
                    <input type="password" value={this.state.password} onChange={this.handleChange}/>
                    <button onClick={this.checkPassword}>Let me in</button>
                </div>
                <div className={`secret ${this.state.open ? "show" : "hide"}`}>
                    <h1>Add feature content</h1>
                    <p>You still have to add bio, title, subtitle etc. directly in Prisma. This is just for the actual content as displayed in paragraphs, including images.</p>
                    <p>When you add an image, you <strong>must not</strong> just copy an image into here. Instead, you <em>copy and paste the url of the image</em>. Otherwise the file is too big and our server can't process it.</p>
                    <FeatureEditor/>
                </div>
            </Container>
        );
    }
}

export default editor;