import { gql } from '@apollo/client';
export const CREATE_CITY = gql `
mutation CreateCity($cityName: String, $stateId: Int, $status: Int, $countryId: Int) {
  createCity(cityName: $cityName, state_id: $stateId, status: $status, country_id: $countryId) {
    data {
      id
      uuid
      cityName
      country_id
      state_id
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


export const CHANGE_CITY_STATUS = gql `
mutation ChangeCityStatus($changeCityStatusId: Int, $status: Int) {
  changeCityStatus(id: $changeCityStatusId, status: $status) {
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


  export const DELETE_CITY = gql `
  mutation DeleteCity($deleteCityId: Int) {
    deleteCity(id: $deleteCityId) {
      data {
        id
        uuid
        country_id
        state_id
        cityName
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

export const UPDATE_CITY = gql `
mutation UpdateCity($updateCityId: Int, $cityName: String, $stateId: Int, $countryId: Int, $status: Int) {
  updateCity(id: $updateCityId, cityName: $cityName, state_id: $stateId, country_id: $countryId, status: $status) {
    data {
      id
      uuid
      country_id
      state_id
      cityName
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
export const GROUP_DELETE_CITY=gql`
mutation GroupDeleteCities($groupDeleteCitiesId: [Int]) {
  groupDeleteCities(id: $groupDeleteCitiesId) {
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