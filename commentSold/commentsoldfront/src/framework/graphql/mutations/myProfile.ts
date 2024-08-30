import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($firstName: String, $lastName: String, $email: String, $phoneNumber: String, $countryCodeId: String) {
    updateProfile(first_name: $firstName, last_name: $lastName, email: $email, phone_number: $phoneNumber, country_code_id: $countryCodeId) {
      data {
        uuid
        first_name
        last_name
        email
        gender
        phone_number
        user_type
        country_code_id
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

export const UPDATE_COMMENTS = gql`
  mutation UpdateCommentKeyWords($keyWords: String, $isDisplayKeyword: Boolean) {
    updateCommentKeyWords(key_words: $keyWords, is_display_keyword: $isDisplayKeyword) {
      data {
        uuid
        first_name
        last_name
        email
        gender
        phone_number
        user_type
        brand_id
        country_code_id
        key_words
        status
        is_display_keyword
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


export const UPDATE_PRIMARY_COLORS = gql`
  mutation UpdatePrimaryColor($primaryColor: String) {
    updatePrimaryColor(primary_color: $primaryColor) {
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