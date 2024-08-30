import { gql } from '@apollo/client';

export const CREATE_LOCATION = gql`
mutation CreateLocation($locationData: CreateLocation!) {
    createLocation(locationData: $locationData) {
      message
      data {
        uuid
        location
        city
      }
    }
  }
`

export const DELETE_LOCATION = gql`
mutation DeleteLocation($locationId: String!) {
  deleteLocation(locationId: $locationId) {
    message
  }
}`

export const UPDATE_LOCATION = gql`
mutation UpdateLocation($locationData: UpdateLocationDto!) {
    updateLocation(locationData: $locationData) {
      message
      data {
        uuid
        location
        city
      }
    }
  }
`