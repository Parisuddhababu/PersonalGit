import { gql } from '@apollo/client';

export const GET_STATE = gql `
query FetchStatesWithPagination($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $name: String, $stateCode: String, $countryId: Int, $status: Int) {
    fetchStatesWithPagination(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, name: $name, state_code: $stateCode, country_id: $countryId, status: $status) {
      data {
        Statedata {
          id
          uuid
          name
          country_id
          state_code
          status
          created_at
          updated_at
          Country {
            name
            country_code
            status
            
          }
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

export const GET_STATE_BY_ID = gql `
query GetState($getStateId: Int) {
  getState(id: $getStateId) {
    data {
      id
      uuid
      name
      state_code
      country_id
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


export const FETCH_COUNTRY = gql `
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
}
`
