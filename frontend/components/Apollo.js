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
    features {
      id
      title
      content
      author
      createdAt
      images
    }
  }
`;

export { CREATE_STORY_MUTATION, STORIES_QUERY, SINGLE_STORY_QUERY, FEATURES_QUERY };
