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

const CREATE_USER_MUTATION = gql`
  mutation CREATE_USER_MUTATION($email: String!) {
    createUser(email: $email) {
      id
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

const STORIES_QUERY = gql`
  query STORIES_QUERY {
    stories(where: {approved: true}, orderBy: createdAt_DESC) {
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
  mutation CREATE_FEATURE_MUTATION($content: String! $address: String!) {
    createFeature( content: $content address: $address ) {
      id
    }
  }
`;

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
  query CURRENT_USER_QUERY {
    me {
      id
      email
      name
      upvotedStories {
        id
      }
    }
  }
`;
const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;
const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
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

export { 
  CREATE_FEATURE_MUTATION, 
  CREATE_STORY_MUTATION, 
  STORIES_QUERY, 
  MODAL_STORY_QUERY, 
  MORE_STORIES_QUERY,
  FEATURES_QUERY, 
  CREATE_USER_MUTATION,
  LATEST_FEATURE_QUERY,
  FEED_PREVIEW_QUERY,
  CATEGORY_FEATURES_QUERY,
  RECENT_FEATURES_QUERY,
  BOOSTED_FEATURES_QUERY,
  CURRENT_USER_QUERY,
  SIGNUP_MUTATION,
  SIGNIN_MUTATION,
  SIGN_OUT_MUTATION,
  REQUEST_RESET_MUTATION,
  RESET_MUTATION,
  UPVOTE_STORY,
  ADD_FEATURE_COMMENT
};
