import { gql } from '@apollo/client';

export const GET_LOCATION = gql`
query GetLocationsWithPagination($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $citySearch: String!, $locationSearch: String!) {
  getLocationsWithPagination(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, citySearch: $citySearch, locationSearch: $locationSearch) {
    message
    data {
      location {
        uuid
        location
        city
        zoneCount
      }
      count
    }
  }
}`

export const GET_ALL_LOCATIONS = gql`query GetLocations {
  getLocations {
    message
    data {
      uuid
      location
      city
      diversion_percentage
      zoneCount
    }
  }
}`;
