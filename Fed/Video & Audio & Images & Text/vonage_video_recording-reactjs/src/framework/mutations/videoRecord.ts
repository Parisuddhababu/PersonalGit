import { gql } from '@apollo/client';

// Video Recording Start
export const STARTRECORDING = gql`
  mutation ($sessionId: String!) {
    startArchive(input: { sessionId: $sessionId }) {
      data {
        archiveId
      }
    }
  }
`;

// Video Retake Start
export const STARTRETAKERECORDING = gql`
  mutation retakeVideo(
    $type: ModuleTypeEnum!
    $archiveId: String!
    $sessionId: String!
  ) {
    retakeVideo(
      input: { type: $type, archiveId: $archiveId, sessionId: $sessionId }
    ) {
      data {
        archiveId
      }
    }
  }
`;

// Video Recording Stop
export const STOPRECORDING = gql`
  mutation ($archiveId: String!) {
    stopArchive(input: { archiveId: $archiveId }) {
      data {
        archiveId
        url
      }
    }
  }
`;
