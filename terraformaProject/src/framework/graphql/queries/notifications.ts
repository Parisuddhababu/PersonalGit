import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query FetchNotificationTemplate(
    $page: Int
    $search: String
    $sortBy: String
    $sortOrder: String
    $limit: Int
  ) {
    fetchNotificationTemplate(
      page: $page
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
      limit: $limit
    ) {
      data {
        notificationdata {
          id
          uuid
          template
          status
          created_at
          updated_at
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
export const GET_NOTIFICATION_BY_ID = gql`
  query GetNotificationTemplate($getNotificationTemplateId: ID) {
    getNotificationTemplate(id: $getNotificationTemplateId) {
      data {
        id
        uuid
        template
        status
        created_at
        updated_at
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
