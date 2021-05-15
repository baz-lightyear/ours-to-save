import moment from 'moment'
import { loadStripe } from '@stripe/stripe-js';
import { endpoint, prodEndpoint, frontEndpoint, prodFrontEndpoint } from '../config.js';
import Swal from 'sweetalert2';
import parse from 'html-react-parser';
import Link from 'next/link';


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
        title: 'Nearly there',
        html: `You'll be redirected to our payments partner to enter card details. By clicking, you confirm your acceptance of the <a href="https://www.ourstosave.com/terms" target="_blank">terms</a> (opens in new window).`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: `Proceed`,
        cancelButtonText: `Back`,
        confirmButtonColor: '#329094',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            const url = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint
            const frontUrl = process.env.NODE_ENV === 'development' ? frontEndpoint : prodFrontEndpoint

            const res = await fetch(`${url}/createStripeCheckoutSession`, {
                method: 'GET',
                headers: ({ 
                    'Content-Type': 'application/json', 
                    'event': 'createStripeCheckoutSession', 
                    'price_id': options.priceId,
                    "success_page": `${frontUrl + options.successRoute}`,
                    "mode": options.mode,
                    "stripe_customer_id": options.stripeCustomerId,
                    'address_instruction': options.addressInstruction,
                }),
            })        
            const sessionId = res.headers.get('sessionId')
            return sessionId
        },
    }).then(async (result) => {
        if (result.isConfirmed) {
            const sessionId = result.value
            const stripe = await stripePromise;
            await stripe.redirectToCheckout({sessionId})
        }
    })
}

const convertRichText = (string, title, recommendedFeatures, previewOnly) => {
    const featureArray = recommendedFeatures
    const leafToHtml = (leaf, index) => {
        // we just go through the rules, wrapping the content one-by-one and return whatever is at the end
        let text = ""
        if (leaf.type === "link") {
            text = leaf.children[0].text
        } else {
            text = leaf.text
        }
        let htmlString = `<span key=${index}>${text}</span>`
        if (leaf.italic) {
            htmlString = `<em key=${index}>${htmlString}</em>`
        }
        if (leaf.bold) {
            htmlString = `<strong key=${index}>${htmlString}</strong>`
        }
        if (leaf.underline) {
            htmlString = `<u key=${index}>${htmlString}</u>`
        }
        if (leaf.type === "link") {
            htmlString = `<a href=${leaf.url} target="_blank" className="link" key=${index}>${htmlString}</a>`
            // for italics in links, the JSON structure is a bit unique
            if (leaf.children[0].italic) {
                htmlString = `<em key=${index}>${htmlString}</em>`
            }
        }                                      
        return parse(htmlString)
    }
    let parsed = JSON.parse(string)
    if (previewOnly) {
        parsed = parsed.slice(0, 10)
    }
    return (
        parsed.map((element, index) => {
            if (element.type === "paragraph") {
                return (
                    <p key={index} className="paragraph">
                        {element.children.map((leaf, index) => leafToHtml(leaf, index))}
                    </p>
                )
            }
            if (element.type === "heading") {
                return (
                    <h3 key={index} className="paragraph">
                        {element.children.map((leaf, index) => leafToHtml(leaf, index))}
                    </h3>
                )
            }
            if (element.type === "block-quote") {
                return (
                    <blockquote key={index}>
                        {element.children.map((leaf, index) => leafToHtml(leaf, index))}
                    </blockquote>
                )
            }
            if (element.type === "image") {
                return (
                    <img key={index} src={optimiseCloudinary(element.url, 800)} className="image" alt={`an image about ${title}`}/>
                )
            }
            if (element.type === "numbered-list") {
                return (
                    <ol key={index}>
                        {element.children.map((listItem, listItemIndex) => {
                            return (
                                <li key={listItemIndex}>
                                    {listItem.children.map((leaf, index) => leafToHtml(leaf, index))}
                                </li>
                            )
                        })}
                    </ol>
                )
            }
            if (element.type === "bulleted-list") {
                return (
                    <ul key={index}>
                        {element.children.map((listItem, listItemIndex) => {
                            return (
                                <li key={listItemIndex}>
                                    {listItem.children.map((leaf, index) => leafToHtml(leaf, index))}
                                </li>
                            )
                        })}
                    </ul>
                )
            }
            if (element.type === "recommended-article") {
                const feature = featureArray[0]
                featureArray.shift()
                if (feature) {
                    return (
                        <Link href={{pathname: '/feature', query: { id: feature.id, title: feature.title }}}>
                            <a className="recommendationLinkWrap">
                                <div key={index} className="recommendationCard">
                                    <div className="left">
                                        <p className="recommendationHeader">More from Ours to Save</p>
                                        <p className="recommendationTitle">{feature.title}</p>
                                        <p className="recommendationAuthor"><strong>{feature.author}</strong></p>
                                    </div>
                                    <div className="right">
                                        <img src={optimiseCloudinary(feature.featuredImage, 400)} alt={feature.title}/>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    )
                }
            }
        })
    )
}

export { 
    optimiseCloudinary,
    timeFromNow,
    visitStripe,
    convertRichText
}