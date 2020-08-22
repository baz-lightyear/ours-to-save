import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Founders from '../components/Founders';


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
    #videoContainer {
        display: block;
        width: 100%;
        padding-bottom: 56.25%;
        position: relative;
        iframe {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            border: solid 2px ${props => props.theme.green};
        }
    }

`;

class supportUs extends Component {
    render() {
        return (
            <Container>
                <h1>Support us</h1>
                <p>If you like what you see here, please consider supporting us.</p>
                <p>One of the biggest things you can do is to <span className="green">tell your friends</span>. Sharing the website or a particular feature on social media is massively helpful.</p>
                <p>We want to make Ours to Save <span className="green">the best it can be</span>  – to make the climate crisis tangible and prove that it’s solvable if we approach it together. To do this, we will start charging a monthly subscription fee - provisionally £3. Members will be able to read longer content from world-class journalists, will be supporting our campaigns, investigations and overall democratisation of environmentalism – and will form an integral part of the Ours to Save community. <span className="green">The map will always be free for all.</span></p>
                <p>If you’d like to make a one-off donation, please email Harry at <a href="mailto: harry@ourstosave.com">harry@ourstosave.com</a> and we'll take it from there.</p>
                {/* <Founders/> */}
            </Container>
        );
    }
}

export default supportUs;