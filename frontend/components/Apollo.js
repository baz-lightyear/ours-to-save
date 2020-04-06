import gql from 'graphql-tag';

const CREATE_STORY_MUTATION = gql`
  mutation CREATE_STORY_MUTATION(
    $title: String!
    $content: String!
    $address: String!
    $good: String!
  ) {
    createStory(
      title: $title
      content: $content
      address: $address
      good: $good
    ) {
      title
    }
  }
`;

const STORIES_QUERY = gql`
  query STORIES_QUERY {
    stories {
      id
      title
      content
      longitude
      latitude
      good
      createdAt
    }
  }
`;

const SINGLE_STORY_QUERY = gql`
  query SINGLE_STORY_QUERY($id: ID!) {
    story(id: $id) {
      title
      content
    }
  }
`;

export { CREATE_STORY_MUTATION, STORIES_QUERY, SINGLE_STORY_QUERY };
