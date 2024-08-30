import { gql } from "@apollo/client";

export const GET_ANNOUNCEMENTS = gql`
  query FetchAnnoucementsWithFilters(
    $page: Int
    $limit: Int
    $sortBy: String
    $sortOrder: String
    $title: String
    $startDate: String
    $endDate: String
    $annoucemntType: String
    $platform: String
    $status: Int
  ) {
    fetchAnnoucementsWithFilters(
      page: $page
      limit: $limit
      sortBy: $sortBy
      sortOrder: $sortOrder
      title: $title
      start_date: $startDate
      end_date: $endDate
      annoucemnt_type: $annoucemntType
      platform: $platform
      status: $status
    ) {
      data {
        announcementData {
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

export const GET_USER = gql`
  query GetUsersWithPagination(
    $page: Int
    $limit: Int
    $sortBy: String
    $sortOrder: String
    $firstName: String
    $lastName: String
    $email: String
    $status: Int
    $gender: Int
    $phoneNo: String
  ) {
    getUsersWithPagination(
      page: $page
      limit: $limit
      sortBy: $sortBy
      sortOrder: $sortOrder
      first_name: $firstName
      last_name: $lastName
      email: $email
      status: $status
      gender: $gender
      phone_no: $phoneNo
    ) {
      data {
        userList {
          id
          uuid
          first_name
          middle_name
          last_name
          user_name
          email
          gender
          date_of_birth
          phone_no
          phone_country_id
          role
          profile_img
          device_type
          status
          user_role_id
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

export const GET_ANNOUNCEMENT_BY_ID = gql`
  query FetchSingleAnnouncement($fetchSingleAnnouncementId: Int) {
    fetchSingleAnnouncement(id: $fetchSingleAnnouncementId) {
      meta {
        statusCode
        status
        messageCode
        message
        type
        errors {
          errorField
          error
        }
        errorType
      }
      data {
        announcement {
          id
          uuid
          user_id
          title
          description
          annoucemnt_type
          platform
          userType
          userFilter
          start_date
          end_date
          status
          created_at
          updated_at
        }
        filter_users
        usersList {
          id
          uuid
          first_name
          middle_name
          last_name
          user_name
          email
          gender
          date_of_birth
          phone_no
          phone_country_id
          role
          profile_img
          device_type
          status
          user_role_id
          created_at
          updated_at
        }
      }
    }
  }
`;

