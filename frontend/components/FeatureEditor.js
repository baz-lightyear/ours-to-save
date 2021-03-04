import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Router from 'next/router'
import styled from 'styled-components';
import { CREATE_FEATURE_MUTATION, UPDATE_FEATURE_MUTATION } from '../lib/Apollo';
import RichtextEditor from './RichtextEditor';


const Container = styled.div`
    padding: 1rem 0;
    textarea, input {
        padding: 0.5rem;
        background-color: ${props => props.theme.offWhite};
        width: 100%;
        margin: 1rem auto;
        font-family: ${props => props.theme.serif};
        border-radius: 4px;
        border: solid 1px;
    }
    select {
        margin: 1rem;
        background-color: ${props => props.theme.offWhite};
        border-radius: 4px;
        border: solid 1px;
    }
    #titleInput {
        font-size: 2rem;
        font-weight: bolder;
    }
    #address {
        min-width: 50%;
        margin: 1rem 0;
    }
`;

const FeatureEditor = (props) => {
    // 'value' is here used as a name for the content of the article itself
    const [value, setValue] = useState(JSON.parse(props.content))
    const [address, setAddress] = useState(props.address)
    const [title, setTitle] = useState(props.title)
    const [subtitle, setSubtitle] = useState(props.subtitle)
    const [bio, setBio] = useState(props.bio)
    const [author, setAuthor] = useState(props.authorName)
    const [category, setCategory] = useState(props.category)
    const [featuredImage, setFeaturedImage] = useState(props.featuredImage)
    const [alwaysFree, setAlwaysFree] = useState(props.alwaysFree)

    const [error, setError] = useState("")
    const [createFeature] = useMutation(CREATE_FEATURE_MUTATION);
    const [updateFeature] = useMutation(UPDATE_FEATURE_MUTATION);

    return (
        <Container>
            <form onSubmit={ async e => {
                e.preventDefault();
                setError("")
                const string = JSON.stringify(value)
                if (props.updating) {
                    const feature = await updateFeature({ variables: {
                        title: title,
                        subtitle: subtitle,
                        bio: bio,
                        author: author,
                        category: category,
                        content: string, 
                        // address: address,
                        featureId: props.featureId,
                        featuredImage: featuredImage,
                        alwaysFree: alwaysFree
                    }}).catch(err => {
                        setError(err.message)
                    })
                    if (feature) {
                        Router.push({
                            pathname: `/feature`,
                            query: { id: props.featureId },
                        })
                    }
                } else {
                    const feature = await createFeature({ variables: { 
                        title: title,
                        subtitle: subtitle,
                        bio: bio,
                        author: author,
                        category: category,
                        content: string, 
                        address: address,
                        featuredImage: featuredImage,
                        alwaysFree: alwaysFree
                    }}).catch(err => {
                        setError(err.message)
                    })
                    if (feature) {
                        window.alert('Uploaded to database - approve in Prisma')
                        Router.push({
                            pathname: '/',
                        });
                    };
                }
            }}>

                <span><strong>Title</strong></span>
                <input name="title" id="titleInput" type="text" required value={title} onChange={(event) => setTitle(event.target.value)}/>
                <span><strong>Subtitle</strong></span>
                <input name="subtitle" type="text" required value={subtitle} onChange={(event) => setSubtitle(event.target.value)}/>
                <span><strong>Author</strong></span>
                <input name="author" type="text" required value={author} onChange={(event) => setAuthor(event.target.value)}/>
                <span><strong>Bio</strong></span>
                <input name="bio" type="text" value={bio} onChange={(event) => setBio(event.target.value)}/>
                <span><strong>Cover photo</strong></span>
                <p>When you add a cover photo, you <strong>must not</strong> just copy an image into here. Instead, you <em>copy and paste the url of the image</em>. Otherwise the file is too big and our server can't process it. Visit Cloudinary <a href="https://cloudinary.com/console/c-db68a86aed67bfc082fda25d3ead23" target="_blank">here</a> (opens in new tab).</p>
                <input name="featuredImage" type="text" value={featuredImage} required onChange={(event) => setFeaturedImage(event.target.value)}/>
                <span><strong>Category</strong></span>
                <select name="category" required value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option value="">--Please choose an option--</option>
                    <option value="power">Power</option>
                    <option value="innovation">Innovation</option>
                    <option value="inspiration">Inspiration</option>
                    <option value="conservation">Conservation</option>
                </select>
                <span style={{marginRight: "1rem"}}><strong>Override automated paywall?</strong></span>
                <input style={{width: "auto"}} type="checkbox" name="alwaysFree" value={alwaysFree} onChange={(event) => {
                    setAlwaysFree(event.target.checked)
                }}/>
                <br/>
                <h3>Text editor:</h3>
                <p>When you add an image, you <strong>must not</strong> just copy an image into here. Instead, you <em>copy and paste the url of the image</em>. Otherwise the file is too big and our server can't process it. Visit Cloudinary <a href="https://cloudinary.com/console/c-db68a86aed67bfc082fda25d3ead23" target="_blank">here</a> (opens in new tab).</p>    
                
                <RichtextEditor value={value} setValue={setValue}/>

                {!props.updating && 
                    <>
                        <br/>
                        <span><strong>Enter address here ideally with postcode</strong></span>
                        <div>
                            <input type="text" id="address" placeholder="" value={address} onChange={(event) => setAddress(event.target.value)}/>
                        </div>
                        <p>You still have to approve it in <a href="https://app.prisma.io/harry-78d82a/services" target="_blank">Prisma</a>! (opens in new tab)</p>
                    </>
                }
                <p style={{color: "red"}}>{error}</p>
                <button type="submit">Upload to database</button>
            </form>
        </Container>
    )
}

export default FeatureEditor;