import { gql } from '@apollo/client';

export const GET_CITY = gql `
query FetchCitiesWithPagination($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $cityName: String, $stateId: Int, $status: Int, $countryId: Int) {
    fetchCitiesWithPagination(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, cityName: $cityName, state_id: $stateId, status: $status, country_id: $countryId) {
      data {
        Citydata {
          id
          uuid
          cityName
          state_id
          createdAt
          updatedAt
          status
          State {
            id
            uuid
            name
            country_id
            state_code
            status
            created_at
            updated_at
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


export const GET_STATE = gql `
query FetchStates {
  fetchStates {
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
          id
          uuid
          name
          country_code
          status
          created_at
          updated_at
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


export const GET_CITY_BY_ID = gql `
  query GetCity($getCityId: Int) {
    getCity(id: $getCityId) {
      data {
        id
        uuid
        cityName
        state_id
        country_id
        createdAt
        updatedAt
        status
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
  
  
