import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query FetchCountries($name: String, $sortBy: String, $sortOrder: String) {
    fetchCountries(name: $name, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        CountryData {
          uuid
          name
          country_code
          phone_code
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
