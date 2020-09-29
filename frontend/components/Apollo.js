import gql from 'graphql-tag';

const CREATE_STORY_MUTATION = gql`
  mutation CREATE_STORY_MUTATION(
    $title: String!
    $content: String!
    $address: String!
    $author: String
    $image: String
  ) {
    createStory(
      title: $title
      content: $content
      address: $address
      author: $author
      image: $image
    ) {
      title
    }
  }
`;

const LATEST_FEATURE_QUERY = gql`
  query LATEST_FEATURE_QUERY {
    latestFeature(where: {approved: true}, orderBy: createdAt_DESC) {
      id
      title
      subtitle
      author
      createdAt
      featuredImage
      category
    }
  }
`;

const RECENT_FEATURES_QUERY = gql`
  query RECENT_FEATURES_QUERY {
    recentFeatures(orderBy: createdAt_DESC) {
      id
      title
      subtitle
      author
      createdAt
      featuredImage
      category
    }
  }
`;

const BOOSTED_FEATURES_QUERY = gql`
  query BOOSTED_FEATURES_QUERY {
    boostedFeatures(orderBy: createdAt_DESC) {
      id
      title
      subtitle
      author
      createdAt
      featuredImage
      category
    }
  }
`;

const MAP_STORIES_QUERY = gql`
  query MAP_STORIES_QUERY($first: Int) {
    mapStories(first: $first, where: {approved: true}, orderBy: createdAt_DESC) {
      id
      title
      content
      country
      longitude
      latitude
      morality
      author
      createdAt
      ourPick
      feature
      sponsored
      countUpvotes
      comments { 
        id 
        createdAt 
        approved 
        content 
        author { 
          name 
        }
      }
    }
  }
`;

const MORE_STORIES_QUERY = gql`
  query MORE_STORIES_QUERY($cursor: String) {
    moreStories(where: {approved: true}, orderBy: createdAt_DESC, cursor: $cursor) {
      id
      title
      content
      longitude
      latitude
      country
      morality
      author
      createdAt
      image
      ourPick
      feature
      sponsored
      countUpvotes
      comments { 
        id 
        createdAt 
        approved 
        content 
        author { 
          name 
        }
      }
    }
  }
`

const MODAL_STORY_QUERY = gql`
  query MODAL_STORY_QUERY($id: ID!) {
    story(id: $id) {
      id
      countUpvotes
      title
      content
      longitude
      latitude
      country
      morality
      createdAt
      author
      image
      comments { 
        id 
        createdAt 
        approved 
        content 
        author { 
          name 
        }
      }
    }
  }
`;

const FEATURES_QUERY = gql`
  query FEATURES_QUERY {
    features(where: {approved: true}, orderBy: createdAt_DESC) {
      id
      title
      subtitle
      author
      createdAt
      featuredImage
      category
    }
  }
`;

const CREATE_FEATURE_MUTATION = gql`
  mutation CREATE_FEATURE_MUTATION(
    $content: String! 
    $address: String!
    $title: String! 
    $subtitle: String! 
    $author: String! 
    $bio: String
    $category: String!
    $featuredImage: String!
  ) {
    createFeature( 
      content: $content 
      address: $address 
      title: $title
      author: $author
      bio: $bio
      subtitle: $subtitle
      category: $category
      featuredImage: $featuredImage
    ) {
      id
    }
  }
`;

const UPDATE_FEATURE_MUTATION = gql`
  mutation UPDATE_FEATURE_MUTATION(
    $content: String! 
    $address: String
    $title: String! 
    $subtitle: String! 
    $author: String! 
    $bio: String
    $category: String!
    $featureId: String!
    $featuredImage: String!
  ) {
    updateFeature( 
      content: $content 
      address: $address 
      title: $title
      author: $author
      bio: $bio
      subtitle: $subtitle
      category: $category
      featureId: $featureId
      featuredImage: $featuredImage
    ) {
      id
    }
  }
`

const FEED_PREVIEW_QUERY = gql`
  query FEED_PREVIEW_QUERY {
    feedPreview(orderBy: createdAt_DESC) {
      id
      title
      country
      author
      createdAt
    }
  }
`;

const CATEGORY_FEATURES_QUERY = gql`
  query CATEGORY_FEATURES_QUERY($category: String) {
    categoryFeatures(category: $category, orderBy: createdAt_DESC) {
      id
      title
      subtitle
      author
      createdAt
      featuredImage
      category
    }
  }
`;


const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY($token: String) {
    me(token: $token) {
      id
      email
      name
      permissions
      upvotedStories {
        id
      }
      stripeCustomerId
      stripeCustomerBalance
    }
  }
`;
const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
      cookieToken
    }
  }
`;

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
      cookieToken
    }
  }
`;

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      email
      name
      cookieToken
    }
  }
`;

const UPVOTE_STORY = gql`
  mutation UPVOTE_STORY($userId: String!, $storyId: String!) {
    upvoteStory(userId: $userId, storyId: $storyId) {
      id
    }
  }
`;

const ADD_FEATURE_COMMENT = gql`
  mutation ADD_FEATURE_COMMENT($content: String!, $authorId: String!, $featureId: String!) {
    addFeatureComment(content: $content, authorId: $authorId, featureId: $featureId) {
      id
    }
  }
`;

const ADD_STORY_COMMENT = gql`
  mutation ADD_STORY_COMMENT($content: String!, $authorId: String!, $storyId: String!) {
    addStoryComment(content: $content, authorId: $authorId, storyId: $storyId) {
      id
    }
  }
`;

const CREATE_STRIPE_BILLING_SESSION = gql`
mutation CREATE_STRIPE_BILLING_SESSION($userId: String!) {
  createStripeBillingSession(userId: $userId) {
    id
    stripeBillingSessionUrl
  }
}
`

const CREATE_STRIPE_SUBSCRIPTION = gql`
mutation CREATE_STRIPE_SUBSCRIPTION($userId: String!, $priceId: String) {
  createStripeSubscription(userId: $userId, priceId: $priceId) {
    id
    stripeCheckoutSessionId
  }
}
`
const UPDATE_REFERRER_MUTATION = gql`
mutation UPDATE_REFERRER_MUTATION($referrerId: String!, $referredId: String) {
  updateReferrer(referrerId: $referrerId, referredId: $referredId) {
    id
    referredBy {
      name
    }
  }
}
`

const GET_MAILING_LIST = gql`
  query GET_MAILING_LIST {
    mailingList {
      id
      name
      email
      permissions
      createdAt
      stripeCustomerId
      stripeCustomerBalance
      referredBy {
        id
      }
    }
  }
`

const ADD_TO_MAILING_LIST = gql`
  mutation ADD_TO_MAILING_LIST($email: String!, $name: String!) {
    addToMailingList(email: $email, name: $name) {
      id
    }
  }
`

export { 
  CREATE_FEATURE_MUTATION, 
  CREATE_STORY_MUTATION, 
  MAP_STORIES_QUERY, 
  MODAL_STORY_QUERY, 
  MORE_STORIES_QUERY,
  FEATURES_QUERY, 
  LATEST_FEATURE_QUERY,
  FEED_PREVIEW_QUERY,
  CATEGORY_FEATURES_QUERY,
  RECENT_FEATURES_QUERY,
  BOOSTED_FEATURES_QUERY,
  CURRENT_USER_QUERY,
  SIGNUP_MUTATION,
  SIGNIN_MUTATION,
  REQUEST_RESET_MUTATION,
  RESET_MUTATION,
  UPVOTE_STORY,
  ADD_FEATURE_COMMENT,
  ADD_STORY_COMMENT,
  UPDATE_FEATURE_MUTATION,
  CREATE_STRIPE_BILLING_SESSION,
  CREATE_STRIPE_SUBSCRIPTION,
  UPDATE_REFERRER_MUTATION,
  GET_MAILING_LIST,
  ADD_TO_MAILING_LIST
};
