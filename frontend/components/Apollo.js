import gql from 'graphql-tag';

const CREATE_STORY_MUTATION = gql`
  mutation CREATE_STORY_MUTATION(
    $title: String!
    $content: String!
  ) {
    createStory(
      title: $title
      content: $content
    ) {
      title
    }
  }
`;

const STORIES_QUERY = gql`
  query STORIES_QUERY {
    stories {
      title
      content
    }
  }
`;

export { CREATE_STORY_MUTATION };
export { STORIES_QUERY };
