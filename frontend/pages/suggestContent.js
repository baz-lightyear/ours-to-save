import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link'

const Container = styled.div`
    font-family: ${props => props.theme.serif};
    text-align: center;
    max-width: 1000px;
    width: 95%;
    margin: 2rem auto;
    button {
        margin-top: 4rem;
    }
`;



class suggestContent extends Component {
    render() {
        return (
            <Container>
                <h1>Suggest content</h1> 
                <p>If you think a story should feature on Ours to Save, there are several ways to get listed on the site. One of the most popular is to simply <strong>add to our crowdsourced interactive map</strong>, which anyone can do <Link href="/addStory"><a>here</a></Link>. If you're a journalist and would like to submit a pitch for a feature, please get in touch with the editor, Florence at <a href="mailto: florence@ourstosave.com">florence@ourstosave.com</a>.</p>
                <p>On the other hand, if you'd like to really spread your message through our community, we can arrange <strong>sponsored content</strong>. Email Harry at <a href="mailto: harry@ourstosave.com">harry@ourstosave.com</a> for more information.</p>
            </Container>
        );
    }
}

export default suggestContent;