import gql from 'graphql-tag';

const CREATE_STORY_MUTATION = gql`
  mutation CREATE_STORY_MUTATION(
    $title: String!
    $content: String!
    $address: String!
    $morality: String!
    $author: String
    $interestedInFeatureEmail: String
    $image: String
  ) {
    createStory(
      title: $title
      content: $content
      address: $address
      morality: $morality
      author: $author
      image: $image
      interestedInFeatureEmail: $interestedInFeatureEmail
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

const STORIES_QUERY = gql`
  query STORIES_QUERY {
    stories(where: {approved: true}, orderBy: createdAt_DESC) {
      id
      title
      content
      longitude
      latitude
      morality
      author
      createdAt
      image
      ourPick
      feature
      sponsored
    }
  }
`;

const SINGLE_STORY_QUERY = gql`
  query SINGLE_STORY_QUERY($id: ID!) {
    story(id: $id) {
      id
      title
      content
      longitude
      latitude
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
    }
  }
`;

const SINGLE_FEATURE_QUERY = gql`
  query SINGLE_FEATURE_QUERY($id: ID!) {
    feature(id: $id) {
      id
      title
      subtitle
      createdAt
      author
      bio
      paragraphs {
        id
        text
        image
      }
      featureLinks {
        id
        title
        ref
      }
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

export { 
  CREATE_FEATURE_MUTATION, 
  CREATE_STORY_MUTATION, 
  STORIES_QUERY, 
  SINGLE_STORY_QUERY, 
  FEATURES_QUERY, 
  SINGLE_FEATURE_QUERY,
  CREATE_USER_MUTATION };
