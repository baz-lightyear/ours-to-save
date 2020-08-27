import styled from 'styled-components';
import React from 'react';

const ErrorStyles = styled.div`
  padding: 0.5rem 1rem;
  background: white;
  margin: 1rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 5px solid ${props => props.theme.green};
  p {
    margin: 0;
    font-weight: 100;
  }
  strong {
    margin-right: 1rem;
  }
`;

const DisplayError = ({ error }) => {
  if (!error || !error.message) return null;
  if (error.networkError && error.networkError.result && error.networkError.result.errors.length) {
    return error.networkError.result.errors.map((error, i) => (
      <ErrorStyles key={i}>
        <p data-test="graphql-error">
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </ErrorStyles>
    ));
  }
  return (
    <ErrorStyles>
      <p data-test="graphql-error">
        {error.message.replace('GraphQL error: ', '')}
      </p>
    </ErrorStyles>
  );
};

DisplayError.defaultProps = {
  error: {},
};

export default DisplayError;
