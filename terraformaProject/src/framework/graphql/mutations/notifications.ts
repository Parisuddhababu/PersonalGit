import { gql } from '@apollo/client';

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotificationTemplate($deleteNotificationTemplateId: ID) {
    deleteNotificationTemplate(id: $deleteNotificationTemplateId) {
      meta {
        message
        messageCode
        statusCode
        status
      }
    }
  }
`;
export const UPDATE_NOTIFICATION = gql`
  mutation UpdateNotificationTemplate(
    $updateNotificationTemplateId: ID
    $status: Int
    $template: String
  ) {
    updateNotificationTemplate(
      id: $updateNotificationTemplateId
      status: $status
      template: $template
    ) {
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
        errors {
          errorField
          error
        }
        errorType
      }
    }
  }
`;
export const CHANGE_NOTIFICATION_STATUS = gql`
  mutation UpdateNotificationTemplate(
    $updateNotificationTemplateId: ID
    $status: Int
  ) {
    updateNotificationTemplate(
      id: $updateNotificationTemplateId
      status: $status
    ) {
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
export const CREATE_NOTIFICATION = gql`
  mutation CreateNotificationTemplate($template: String) {
    createNotificationTemplate(template: $template) {
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
      }
    }
  }
`;
export const GROUP_DELETE_NOTIFICATION = gql`mutation GroupDeletenotificationTemplate($groupDeletenotificationTemplateId: [Int]) {
  groupDeletenotificationTemplate(id: $groupDeletenotificationTemplateId) {
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
}`;