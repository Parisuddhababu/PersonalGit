import { gql } from '@apollo/client';

export const CREATE_ANNOUNCEMENT = gql`
mutation CreateAnnouncement($title: String, $description: String, $announcementType: String, $emailAttachment: String, $pushImage: String, $platform: String, $userType: String, $userFilter: String, $userToExclude: [Int], $onlySendTo: [Int], $startDate: Date, $endDate: Date) {
  createAnnouncement(title: $title, description: $description, announcement_type: $announcementType, email_attachment: $emailAttachment, push_image: $pushImage, platform: $platform, userType: $userType, userFilter: $userFilter, userToExclude: $userToExclude, onlySendTo: $onlySendTo, start_date: $startDate, end_date: $endDate) {
    data {
      id
      uuid
      user_id
      title
      description
      announcement_type
      email_attachment
      push_image
      platform
      userType
      userFilter
      userToExclude
      onlySendTo
      start_date
      end_date
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
}`

export const UPDATE_READ_ANNOUNCEMENTS_FOR_USER = gql`
  mutation UpdateReadAnnouncementsForUser {
    updateReadAnnouncementsForUser {
      message
      data {
        announcements {
          uuid
          title
          description
          createdAt
        }
        count
      }
    }
  }
`