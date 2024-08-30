import { gql } from '@apollo/client';

export const DELETE_EVENT = gql`
mutation DeleteEvent($deleteEventId: Int) {
  deleteEvent(id: $deleteEventId) {
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
export const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $updateEventId: Int
    $eventName: String
    $description: String
    $sendNotification: Boolean
    $address: String
    $startDate: Date
    $endDate: Date
    $isRecurring: String
    $recurrenceDate: Date
    $participantMailIds: [String]
  ) {
    updateEvent(
      id: $updateEventId
      event_name: $eventName
      description: $description
      send_notification: $sendNotification
      address: $address
      start_date: $startDate
      end_date: $endDate
      is_reccuring: $isRecurring
      reccurance_date: $recurrenceDate
      participant_mail_ids: $participantMailIds
    ) {
      meta {
        message
        messageCode
        statusCode
        status
      }
    }
  }
`;
export const CREATE_EVENT = gql`
  mutation CreateEvent(
    $eventName: String
    $description: String
    $sendNotification: Boolean
    $address: String
    $startDate: Date
    $endDate: Date
    $isRecurring: String
    $recurrenceDate: Date
  ) {
    createEvent(
      event_name: $eventName
      description: $description
      send_notification: $sendNotification
      address: $address
      start_date: $startDate
      end_date: $endDate
      is_reccuring: $isRecurring
      reccurance_date: $recurrenceDate
    ) {
      meta {
        message
        messageCode
        statusCode
        status
      }
    }
  }
`;
export const GROUP_DELETE_EVENTS = gql`mutation GroupDeleteEvents($groupDeleteEventsId: [Int]) {
  groupDeleteEvents(id: $groupDeleteEventsId) {
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
