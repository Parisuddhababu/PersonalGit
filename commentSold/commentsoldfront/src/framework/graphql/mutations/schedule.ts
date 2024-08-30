import { gql } from "@apollo/client";

export const SCHEDULE_STREAMING = gql`
  mutation ScheduleStreaming($scheduleDate: Date, $scheduleTime: String, $timeZone: String, $streamTitle: String, $streamDescription: String, $influencers: [influencersList], $email: [String]) {
    scheduleStreaming(
      schedule_date: $scheduleDate
      schedule_time: $scheduleTime
      timeZone: $timeZone
      stream_title: $streamTitle
      stream_description: $streamDescription
      influencers: $influencers
      email: $email
    ) {
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

export const DELETE_SCHEDULE_STREAMING = gql`
  mutation Mutation($scheduleUuid: String) {
    deleteScheduleStreaming(schedule_uuid: $scheduleUuid) {
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

export const UPDATE_SCHEDULE_STREAMING = gql`
  mutation UpdateStreamingSchedule($scheduleUuid: String, $scheduleDate: Date, $scheduleTime: String, $timeZone: String, $streamTitle: String, $streamDescription: String) {
    updateStreamingSchedule(
      schedule_uuid: $scheduleUuid
      schedule_date: $scheduleDate
      schedule_time: $scheduleTime
      timeZone: $timeZone
      stream_title: $streamTitle
      stream_description: $streamDescription
    ) {
      data {
        uuid
        schedule_date
        schedule_time
        HostDetails {
          first_name
          last_name
          email
          status
        }
        BrandDomainDetails {
          uuid
          domain_name
          status
        }
        timeZone
        stream_title
        stream_description
        end_date
        status
        invite {
          uuid
          product_id
          invitation_url
          invited_user_email
        }
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
