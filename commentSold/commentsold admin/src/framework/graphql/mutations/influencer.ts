import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CREATE_INFLUENCER = gql`
${META_FRAGMENT}
mutation Mutation($firstName: String, $lastName: String, $email: String, $gender: Gender, $countryCodeId: String, $phoneNumber: String) {
  createInfluencer(first_name: $firstName, last_name: $lastName, email: $email, gender: $gender, country_code_id: $countryCodeId, phone_number: $phoneNumber) {
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
    meta {...MetaFragment}
  }
}
`;

export const UPDATE_INFLUENCER = gql`
${META_FRAGMENT}

mutation UpdateInfluencer($uuid: UUID, $firstName: String, $lastName: String, $gender: Gender, $phoneNumber: String, $countryCodeId: String) {
  updateInfluencer(uuid: $uuid, first_name: $firstName, last_name: $lastName, gender: $gender, phone_number: $phoneNumber, country_code_id: $countryCodeId) {
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
    meta {...MetaFragment}
  }
}
`;

export const DELETE_INFLUENCER = gql`
${META_FRAGMENT}

mutation DeleteInfluencer($uuid: UUID) {
  deleteInfluencer(uuid: $uuid) {
    meta {
      ...MetaFragment
     }
  }
}

`;

export const UPDATE_INFLUENCER_STATUS = gql`
${META_FRAGMENT}

mutation UpdateFrontInfluencerStatus($uuid: UUID, $status: UserStatus) {
  updateFrontInfluencerStatus(uuid: $uuid, status: $status) {
    meta {
      ...MetaFragment
     }
  }
}
`;