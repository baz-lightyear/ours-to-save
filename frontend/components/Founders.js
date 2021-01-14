import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    background-color: ${props => props.theme.lightgreen};
    text-align: center;
    padding: 0.5rem;
    width: 100vw;
    font-family: ${props => props.theme.serif};
`;

const Filler = styled.div

class Founders extends Component {
    render() {
        return (
            <Container>
                <h3>We're grateful for the support of our Founding Members, including:</h3>
                <p><em>Heather Phelps · Jacqui Hocking · Emelie Strand · Joanna Ka Wai Wong · Tash Seaton · Lee Murray · Johan Awan · David Keene · Katie Brown · Hugh Cutting · Katie Orr · Di Wildblood · Andrew Wildblood · Martin Spielverlag · Reiter Spielverlag · Neena Paul · Juliette Corrin · Iona Miller · Laura Cameron · Caitlin Mullin · Emma Corrin · Thomas Lingard · Esme Audland · Krisztina Bana · Finley Kamen · Edward Pinnegar · Gareth Phillips · Eleanor Hulm · Clara Meyer-Horn · Katie Ball · Jasper Vardag-Hunter · Thomas Prais · Holly Kingdon · Lou Edwards · Florence Li · Matt Kingdon · Alice Kingdon · George Horner · and especially Abigail Anna Swan for design services. Some icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> via <a href="https://www.flaticon.com/" title="Flaticon">Flaticon</a>.</em></p>
            </Container>
        );
    }
}

export default Founders;