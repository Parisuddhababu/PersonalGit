import { gql } from "@apollo/client";

export const CREATE_INFLUENCER = gql`
  mutation CreateBrandInfluencer($firstName: String, $lastName: String, $email: String, $gender: Gender, $countryCodeId: String, $phoneNumber: String) {
    createBrandInfluencer(first_name: $firstName, last_name: $lastName, email: $email, gender: $gender, country_code_id: $countryCodeId, phone_number: $phoneNumber) {
      data {
        uuid
        first_name
        last_name
        email
        gender
        phone_number
        user_type
        country_code_id
        UserBrandDomainData {
          uuid
          domain_name
          status
        }
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

export const UPDATE_INFLUENCER = gql`
  mutation UpdateFrontInfluencer($uuid: UUID, $firstName: String, $lastName: String, $gender: Gender, $phoneNumber: String, $countryCodeId: String) {
    updateFrontInfluencer(uuid: $uuid, first_name: $firstName, last_name: $lastName, gender: $gender, phone_number: $phoneNumber, country_code_id: $countryCodeId) {
      data {
        uuid
        first_name
        last_name
        email
        gender
        phone_number
        user_type
        country_code_id
        UserBrandDomainData {
          uuid
          domain_name
          status
        }
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

export const UPDATE_INFLUENCER_STATUS = gql`
  mutation UpdateFrontInfluencerStatus($uuid: UUID, $status: UserStatus) {
    updateFrontInfluencerStatus(uuid: $uuid, status: $status) {
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

export const DELETE_INFLUENCER = gql`
  mutation DeleteFrontInfluencer($uuid: UUID) {
    deleteFrontInfluencer(uuid: $uuid) {
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
