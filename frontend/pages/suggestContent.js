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
                <p>If you think a story should feature on Ours to Save, there are several ways to get listed on the site.
                {/* One of the most popular is to simply <strong>add to our crowdsourced interactive map</strong>, which anyone can do <Link href="/addStory"><a>here</a></Link>.  */}
                <br/>For journalism, we do one pitch call every month for the month coming up. Please don’t pitch us outside of the allotted time (the end of every month - check our socials for specifics) unless you’re happy for your pitch to kept on file for a few weeks. It’s unlikely that we’ll reply to pitch emails outside of these times! Likewise with chasing up, we always endeavour to reply to anyone who sends in a pitch but this tends to be in bulk at the end of the month - so rest assured we will get to you. Please email us at <a href="mailto: hello@ourstosave.com">hello@ourstosave.com</a> - pitches to other emails may not receive a reply!</p>
            </Container>
        );
    }
}

export default suggestContent;