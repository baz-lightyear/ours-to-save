import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
    font-family: ${props => props.theme.serif};
    width: 90%;
    max-width: 800px;
    margin: 1rem auto;
    h1 {
        text-align: center;
    }
    .green {
        color: ${props => props.theme.green};
    }
    #FlossAndBaz {
        text-align: right;
    }
    .button {
        text-align: center;
        padding: 1rem 0rem;
        a {
            border: solid 2px ${props => props.theme.green};
            padding: 0.5rem 2rem;
            font-family: ${props => props.theme.sansSerif};
            font-weight: 700;
            color: ${props => props.theme.green};
            &:hover {
                color: ${props => props.theme.black};
                border: solid 2px ${props => props.theme.black};
            }
        }
    }

`;

class supportUs extends Component {
    render() {
        return (
            <Container>
                <h1>Support us</h1>
                <p>If you like what you see here and want to help us grow the site and keep our writers paid fairly, please consider donating to our Kickstarter below. </p>
                <p>We want to make Ours to Save <span className="green">the best it can be</span> – to make the climate crisis tangible and prove that it’s solvable if we approach it together. In keeping with this, the entirety of our website will be free for everyone while we weather the worst of the coronavirus pandemic. In around July, we’ll introduce a small subscription fee for access to the news page. <span className="green">The map will always be free for all.</span></p>
                <p>We want as many people as possible to see Ours to Save in the next few months, but we still have a lot of costs to cover, so external donations will be an enormous help in getting our feet off the ground.  If you’re able to donate, any amount - large or small - would mean the world. </p>
                <p style={{textAlign: "center"}}>Thank you - we won’t be able to do it without you.</p>
                <p style={{textAlign: "center"}}>Florence & Harry</p>
                <div className="button"><a href="" target="_blank">donate now</a></div>
            </Container>
        );
    }
}

export default supportUs;