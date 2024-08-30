import { gql } from '@apollo/client';

  export const GET_ANNOUNCEMENTS = gql `
  query FetchAnnouncementsWithFilters($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $title: String, $startDate: String, $endDate: String, $announcementType: String, $platform: String, $status: Int) {
    fetchAnnouncementsWithFilters(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, title: $title, start_date: $startDate, end_date: $endDate, announcement_type: $announcementType, platform: $platform, status: $status) {
      data {
        announcementData {
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
  }`




export const GET_USER = gql `
query GetUsersWithPagination($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $firstName: String, $lastName: String, $email: String, $status: Int, $gender: Int, $phoneNo: String) {
  getUsersWithPagination(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, first_name: $firstName, last_name: $lastName, email: $email, status: $status, gender: $gender, phone_no: $phoneNo) {
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
`

export const GET_ANNOUNCEMENT_HISTORY_FOR_USER = gql`
  query GetAnnouncementHistoryForUser($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getAnnouncementHistoryForUser(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
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

export const GET_ANNOUNCEMENTS_FOR_USERS = gql`
  query GetAnnouncementsForUser {
    getAnnouncementsForUser {
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

export const GET_ANNOUNCEMENT_BY_ID = gql `
  query GetAnnouncementById($announcementId: String!) {
    getAnnouncementById(announcementId: $announcementId) {
      message
      data {
        title
        uuid
        description
        createdAt
      }
    }
  }
`

export const GET_ANNOUNCEMENTS_FOR_USER = gql`
  query GetAnnouncementsForUser {
    getAnnouncementsForUser {
      message
      data {
        announcements {
          uuid
          title
          description
        }
        count
      }
    }
  }
`