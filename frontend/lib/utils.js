import moment from 'moment'
import { loadStripe } from '@stripe/stripe-js';
import { endpoint, prodEndpoint } from '../config.js';
import Swal from 'sweetalert2';
const stripePromise = loadStripe('pk_live_51HDyyHIcB8KtT8kgeO0eGq0SflBIGCgTzMSDWIlXyG4Am9Q01lpNjl7zS40e93dK5j94lOyGnaR2bBnf8K6bSpyv00bGnVCPMR')

const optimiseCloudinary = (url, width) => {
    if (/(.*)res.cloudinary(.*)$/.exec(url)) {
        return `${/(.*)upload\/(.*)$/.exec(url)[1]}upload/q_auto,f_auto,fl_lossy,w_${width}/${/(.*)upload\/(.*)$/.exec(url)[2]}`
    } else {
        return url
    }
}
const timeFromNow = (time) => {
    return moment(time).fromNow()
}

const visitStripe = async (options) => {
    // this method creates a Stripe Checkout Session. Since there are lots of different types of session we want to create, we take the argument 'options' which is a set of key-value pairs
    Swal.fire({
        title: 'heres a title',
        html: `here's a descriptoin her's a description pls check the terms <a href="https://www.ourstosave.com/terms" target="_blank">link</a>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: `Do it`,
        cancelButtonText: `Don't do it`,
        confirmButtonColor: '#329094',
    }).then(async (result) => {
        if (result.isConfirmed) {
        // this all needs some loading prompts
            const url = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint
            const res = await fetch(`${url}/createStripeCheckoutSession`, {
                method: 'GET',
                headers: ({ 
                    'Content-Type': 'application/json', 
                    'event': 'createStripeCheckoutSession', 
                    'price_id': options.priceId,
                    "success_page": `${url + options.successRoute}`,
                    "mode": options.mode,
                    "stripe_customer_id": options.stripeCustomerId,
                    'address_instruction': options.addressInstruction,
                }),
            })        
            const sessionId = res.headers.get('sessionId')
            const stripe = await stripePromise;
            await stripe.redirectToCheckout({sessionId})
        }
    })
}

export { 
    optimiseCloudinary,
    timeFromNow,
    visitStripe
}