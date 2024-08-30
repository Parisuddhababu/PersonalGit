import { gql } from '@apollo/client';

export const SUBSCRIBER_LOCATION = gql `
  query SubscriberLocations($companyId: String!) {
    subscriberLocations(companyId: $companyId) {
      message
      data {
        uuid
        location
        city
      }
    }
  }
` 

export const GET_USER_LOCATION = gql `
  query GetUserLocation($companyId: String!) {
    getUserLocation(companyId: $companyId) {
      message
      data {
        branch {
          uuid
          location
          city
        }
      }
    }
  }
`