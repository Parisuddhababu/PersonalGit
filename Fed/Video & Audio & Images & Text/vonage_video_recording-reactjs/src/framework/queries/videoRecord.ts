import { gql } from '@apollo/client';

export const GETVONAGETOKEN = gql`
  {
    getSessionToken {
      data {
        sessionId
        token
        apiKey
      }
    }
  }
`;

export const VIEWARCHIVE = gql`
  query ($uuid: String!) {
    viewArchive(input: { archiveId: $uuid }) {
      data {
        url
        status
      }
    }
  }
`;