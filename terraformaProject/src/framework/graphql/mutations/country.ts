import { gql } from '@apollo/client';
export const CREATE_COUNTRY = gql`
  mutation CreateCountry($name: String, $countryCode: String, $status: Int) {
    createCountry(name: $name, country_code: $countryCode, status: $status) {
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
`;

export const CHANGE_COUNTRY_STATUS = gql`
  mutation ChangeCountryStatus($changeCountryStatusId: Int, $status: Int) {
    changeCountryStatus(id: $changeCountryStatusId, status: $status) {
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
`;

export const DELETE_COUNTRY = gql`
  mutation DeleteCountry($deleteCountryId: Int) {
    deleteCountry(id: $deleteCountryId) {
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
`;

export const UPDATE_COUNTRY = gql`
  mutation UpdateCountry(
    $updateCountryId: Int
    $name: String
    $countryCode: String
    $status: Int
  ) {
    updateCountry(
      id: $updateCountryId
      name: $name
      country_code: $countryCode
      status: $status
    ) {
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
`;
export const GROUP_DELETE_COUNTRY = gql`
  mutation GroupDeleteCountries($groupDeleteCountriesId: [Int]) {
    groupDeleteCountries(id: $groupDeleteCountriesId) {
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
