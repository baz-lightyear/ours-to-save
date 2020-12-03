import React, { Component } from 'react';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { endpoint, prodEndpoint } from '../config.js';
const stripePromise = loadStripe('pk_live_51HDyyHIcB8KtT8kgeO0eGq0SflBIGCgTzMSDWIlXyG4Am9Q01lpNjl7zS40e93dK5j94lOyGnaR2bBnf8K6bSpyv00bGnVCPMR')

const Container = styled.div`
    .products {
        display: flex;
        .product {
            border: solid 1px black;
            padding: 0.5rem;
            margin: 0.5rem;
        }
    }
`;

class gift extends Component {

    visitStripe = async (priceId) => {
        const url = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint
        const res = await fetch(`${url}/createStripeCheckoutSession`, {
            method: 'GET',
            headers: ({ 'Content-Type': 'application/json', 'event': 'createStripeCheckoutSession', 'price_id': priceId}),
        })        
        const sessionId = res.headers.get('sessionId')
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({sessionId})
    }

    render() {
        return (
            <Container>
                <h1>Buy a gift card</h1>
                <p>Some marketing spiel</p>
                <div className="products">
                    <div className="product">
                        <h4>Product name</h4>
                        <ul>
                            <li>✔️ feature 1</li>
                            <li>✔️ feature 2</li>
                            <li>✔️ feature 3</li>
                            <li>✔️ feature 4</li>
                        </ul>
                        <h5>Price: £0.00</h5>
                        <button onClick={() => this.visitStripe("price_1HtxGoIcB8KtT8kgC1UHUCRQ")}>consent & buy</button>
                    </div>
                    <div className="product">
                        <h4>Product name</h4>
                        <ul>
                            <li>✔️ feature 1</li>
                            <li>✔️ feature 2</li>
                            <li>✔️ feature 3</li>
                            <li>✔️ feature 4</li>
                        </ul>
                        <h5>Price: £0.00</h5>
                        <button onClick={() => this.visitStripe("enterIdHere")}>consent & buy</button>
                    </div>
                    <div className="product">
                        <h4>Product name</h4>
                        <ul>
                            <li>✔️ feature 1</li>
                            <li>✔️ feature 2</li>
                            <li>✔️ feature 3</li>
                            <li>✔️ feature 4</li>
                        </ul>
                        <h5>Price: £0.00</h5>
                        <button onClick={() => this.visitStripe("enterIdHere")}>consent & buy</button>
                    </div>
                    <div className="product">
                        <h4>Test gift</h4>
                        <ul>
                            <li>✔️ feature 1</li>
                            <li>✔️ feature 2</li>
                            <li>✔️ feature 3</li>
                            <li>✔️ feature 4</li>
                        </ul>
                        <h5>Price: £1</h5>
                        <button onClick={() => this.visitStripe("price_1HuGUDIcB8KtT8kggcognJ4b")}>consent & buy</button>
                    </div>
                </div>
                this is where you can buy a gift card
            </Container>
        );
    }
}

export default gift;