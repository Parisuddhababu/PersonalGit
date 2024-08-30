import { gql } from '@apollo/client';

export const SEARCH_SUBADMIN = gql`
query SearchSubAdmin($firstName: String, $lastName: String, $email: String, $status: Int, $role: Int) {
    searchSubAdmin(first_name: $firstName, last_name: $lastName, email: $email, status: $status, role: $role) {
      data {
        count
        subAdminData {
          id
          first_name
          last_name
          user_name
          email
          password
          role
          status
          created_at
          updated_at
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
`

export const GET_SUBADMIN = gql `
query GetSubAdmins($page: Int, $limit: Int,  $sortBy: String, $sortOrder: String, $firstName: String, $lastName: String, $email: String, $status: Int, $role: Int) {
  getSubAdmins(page: $page, limit: $limit,sortBy: $sortBy, sortOrder: $sortOrder, first_name: $firstName, last_name: $lastName, email: $email, status: $status, role: $role) {
    data {
      subAdminData {
        id
        first_name
        last_name
        user_name
        email
        password
        role
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
        error
        errorField
      }
      errorType
    }
  }
}`

export const GET_SUBADMIN_BY_ID = gql `
query GetSubAdmin($getSubAdminId: Int) {
  getSubAdmin(id: $getSubAdminId) {
    data {
      id
      first_name
      last_name
      user_name
      email
      password
      role
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
`