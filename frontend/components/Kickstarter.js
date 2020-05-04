import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    background-color: ${props => props.theme.lightgreen};
    text-align: center;
    color: ${props => props.theme.black};
    margin: 0 auto;
    padding: 1rem;
    .button {
        text-align: center;
        display: block;
        margin: 2rem 0 1rem 0;
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
    #extraContainer {
        width: 90%;
        margin: auto;
        max-width: 800px;
    }
    #videoContainer {
        display: block;
        width: 100%;
        margin: auto;
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
    #close {
        cursor: pointer;
        font-weight: bold;
        position: relative;
        top: 1rem;
        right: 1rem;
    }
    .closeDiv {
        text-align: right;
    }
    &.hide {
        display: none;
    }
`;

class Kickstarter extends Component {
    state = {
        open: true
    }
    closeAlert = () => {
        this.setState({open: false})
    }
    render() {
        return (
            <Container className={this.state.open ? "show" : "hide"}>
                <div className="closeDiv">
                    <span id="close" onClick={this.closeAlert}>╳</span>
                </div>
                <h3>May 2020 update</h3>
                <h2>A special message from Florence and Harry</h2>
                <p>Support us on Kickstarter as a Founding Member for exclusive discount membership and to get featured on the site.</p>
                <div id="extraContainer">
                    <div id="videoContainer">
                        <iframe src="https://www.kickstarter.com/projects/ourstosave/ours-to-save/widget/video.html" frameborder="0" scrolling="no"> </iframe>            
                    </div>
                </div>
                <div className="button"><a href="http://kck.st/35tFnDE" target="_blank">donate now</a></div>
            </Container>
        );
    }
}

export default Kickstarter;