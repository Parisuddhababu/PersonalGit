import { gql } from "@apollo/client";

export const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement(
    $title: String
    $description: String
    $annoucemntType: String
    $emailAttachment: String
    $pushImage: String
    $platform: String
    $userType: String
    $userFilter: String
    $userToExclude: [Int]
    $onlySendTo: [Int]
    $startDate: Date
    $endDate: Date
  ) {
    createAnnouncement(
      title: $title
      description: $description
      annoucemnt_type: $annoucemntType
      email_attachment: $emailAttachment
      push_image: $pushImage
      platform: $platform
      userType: $userType
      userFilter: $userFilter
      userToExclude: $userToExclude
      onlySendTo: $onlySendTo
      start_date: $startDate
      end_date: $endDate
    ) {
      data {
        id
        uuid
        user_id
        title
        description
        annoucemnt_type
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
  }
`;
