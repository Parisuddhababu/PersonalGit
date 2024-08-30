import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query FetchEvents(
    $page: Int
    $limit: Int
    $sortBy: String
    $sortOrder: String
    $eventName: String
    $startDate: Date
    $endDate: Date
    $createdBy: Int
  ) {
    fetchEvents(
      page: $page
      limit: $limit
      sortBy: $sortBy
      sortOrder: $sortOrder
      event_name: $eventName
      start_date: $startDate
      end_date: $endDate
      created_by: $createdBy
    ) {
      data {
        FetchEventData {
          id
          event_name
          description
          is_reccuring
          start_date
          end_date
          User {
            user_name
          }
        }
        count
      }
      meta {
        message
        messageCode
        statusCode
        status
      }
    }
  }
`;
export const GET_EVENT_BY_ID = gql`
query FetchEvent($fetchEventId: ID) {
  fetchEvent(id: $fetchEventId) {
    data {
      id
      uuid
      event_name
      description
      email
      address
      is_reccuring
      send_notification
      start_date
      end_date
      status
      participant_mail_ids
      reccurance_date
      created_at
      updated_at
      created_by
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
export const GET_DROPDOWNFILTER_DATA = gql`
  query FetchEvents(
    $createdBy: Int
    $startDate: Date
    $endDate: Date
    $eventName: String
    $sortOrder: String
    $sortBy: String
    $limit: Int
    $page: Int
  ) {
    fetchEvents(
      created_by: $createdBy
      start_date: $startDate
      end_date: $endDate
      event_name: $eventName
      sortOrder: $sortOrder
      sortBy: $sortBy
      limit: $limit
      page: $page
    ) {
      data {
        FetchEventData {
          event_name
          start_date
          end_date
          created_by
          User {
            user_name
          }
        }
        count
      }
      meta {
        message
        messageCode
        statusCode
        status
        type
      }
    }
  }
`;
export const VIEW_EVENT = gql`
  query FetchEvent($fetchEventId: ID) {
    fetchEvent(id: $fetchEventId) {
      data {
        id
        event_name
        description
        email
        is_reccuring
        start_date
        end_date
      }
      meta {
        message
        messageCode
        statusCode
        status
      }
    }
  }
`;
