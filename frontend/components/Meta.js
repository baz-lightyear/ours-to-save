import Head from 'next/head';

const Meta = (props) => (
  <>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <meta name="application-name" content="Ours to save"/>
    <meta name="author" content="Flossie Wildblood and Harry Kingdon" />
    <meta name="description" content="Crowdsourced, breaking news on the climate - use our interactive map"/>

    
    
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css?family=Martel:300,700&display=swap" rel="stylesheet"/>
    <title>Ours to Save</title>

    {/* Facebook/WhatsApp/Instagram metatags */}

    <meta property="og:url"                content="https://ourstosave.com" key="url"/>
    <meta property="og:title"              content="Ours to Save" key="title"/>
    <meta property="og:description"        content="Crowdsourced, breaking news on the climate - use our interactive map" key="description"/>
    <meta property="og:image"              content="https://images.unsplash.com/photo-1559294824-627e9738df81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80" key="image"/>
    <meta property="og:type"               content="website" key="type"/>
    <meta property="og:locale" content="en_GB" />

    {/* Favicons courtesy of faviconit */}

    <link rel="shortcut icon" href="favicons/favicon.ico" />
    <link rel="icon" sizes="16x16 32x32 64x64" href="favicons/favicon.ico" />
    <link rel="icon" type="image/png" sizes="196x196" href="favicons/favicon-192.png" />
    <link rel="icon" type="image/png" sizes="160x160" href="favicons/favicon-160.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="favicons/favicon-96.png" />
    <link rel="icon" type="image/png" sizes="64x64" href="favicons/favicon-64.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16.png" />
    <link rel="apple-touch-icon" href="favicons/favicon-57.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="favicons/favicon-114.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="favicons/favicon-72.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="favicons/favicon-144.png" />
    <link rel="apple-touch-icon" sizes="60x60" href="favicons/favicon-60.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="favicons/favicon-120.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="favicons/favicon-76.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="favicons/favicon-152.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="favicons/favicon-180.png" />
    <meta name="msapplication-TileColor" content="#FFFFFF"/>
    <meta name="msapplication-TileImage" content="favicons/favicon-144.png"/>
    <meta name="msapplication-config" content="favicons/browserconfig.xml"/>
  </>
);

export default Meta;
