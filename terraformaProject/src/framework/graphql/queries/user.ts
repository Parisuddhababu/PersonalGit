import { gql } from '@apollo/client';

export const testGetUser = gql`
  query testFetch {
    testFetch {
      id
      user_name
    }
  }
`;

export const GET_USER = gql`
  query GetUsersWithPagination(
    $page: Int
    $limit: Int
    $sortOrder: String
    $firstName: String
    $sortBy: String
    $lastName: String
    $email: String
    $status: Int
    $gender: Int
    $phoneNo: String
  ) {
    getUsersWithPagination(
      page: $page
      limit: $limit
      sortOrder: $sortOrder
      first_name: $firstName
      sortBy: $sortBy
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
          email
          gender
          phone_no
          phone_country_id
          role
          profile_img
          status
          user_role_id
          date_of_birth
          created_at
          updated_at
          user_name
        }
        count
      }
      meta {
        errors {
          errorField
          error
        }
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUser($getUserId: Int) {
    getUser(id: $getUserId) {
      data {
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
        status
        user_role_id
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
export const GET_USERS_LIST = gql`
  query GetUsers {
    getUsers {
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
