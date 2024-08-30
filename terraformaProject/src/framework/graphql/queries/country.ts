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

export const GET_ALL_COUNTRY = gql `
query FetchCountriesWithPagination($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $name: String, $countryCode: String, $status: Int) {
  fetchCountriesWithPagination(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, name: $name, country_code: $countryCode, status: $status) {
    data {
      Countrydata {
        id
        uuid
        name
        country_code
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

export const GET_COUNTRY_BY_ID = gql `
query GetCountry($getCountryId: Int) {
  getCountry(id: $getCountryId) {
    data {
      id
      uuid
      name
      country_code
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