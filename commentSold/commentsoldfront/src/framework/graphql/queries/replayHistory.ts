import { gql } from "@apollo/client";

export const GET_HISTORY = gql`
  query FetchStreamingHistory($page: Int, $limit: Int, $name: String, $sortBy: String, $sortOrder: String) {
    fetchStreamingHistory(page: $page, limit: $limit, name: $name, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        streamings {
          uuid
          stream_title
          stream_description
          start_time
          end_time
          duration
          schedule_stream_title
        }
        count
      }
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
    }
  }
`;
