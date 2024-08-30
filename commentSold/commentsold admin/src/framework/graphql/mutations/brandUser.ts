import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const DELETE_BRAND_USER = gql`
${META_FRAGMENT}
mutation DeleteBrandUser($uuid: UUID) {
    deleteBrandUser(uuid: $uuid) {
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const UPDATE_BRAND_USER = gql`
${META_FRAGMENT}
mutation UpdateBrandUser($uuid: UUID, $firstName: String, $companyName: String,$lastName: String, $gender: Gender, $phoneNumber: String, $countryCodeId: String, $influencerCount: Int, $currentSessionCount: Int) {
  updateBrandUser(uuid: $uuid,company_name: $companyName, first_name: $firstName, last_name: $lastName, gender: $gender, phone_number: $phoneNumber, country_code_id: $countryCodeId, influencer_count: $influencerCount, current_session_count: $currentSessionCount) {
    meta {
      ...MetaFragment
    }
  }
}
`;

export const CREATE_BRAND_USER = gql`
${META_FRAGMENT}
mutation CreateBrandUser($firstName: String, $domainName: String,$companyName: String, $lastName: String, $email: String, $phoneNumber: String, $gender: Gender, $countryCodeId: String, $influencerCount: Int, $sessionCount: Int) {
  createBrandUser(first_name: $firstName, domain_name: $domainName,company_name: $companyName, last_name: $lastName, email: $email, phone_number: $phoneNumber, gender: $gender, country_code_id: $countryCodeId, influencer_count: $influencerCount, session_count: $sessionCount) {
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
      UserBrandDomainData {
        uuid
        domain_name
        status
      }
      UserBrandSettingData {
        uuid
        influencer_count
        session_count
      }
      created_at
      updated_at
    }
    meta {
      ...MetaFragment
    }
  }
}
`;