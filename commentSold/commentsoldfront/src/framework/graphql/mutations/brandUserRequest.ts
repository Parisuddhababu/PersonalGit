import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const CREATE_BRAND_USER_REQUEST = gql`
${META_FRAGMENT}
mutation CreateBrandUserRequest($brandName: String,$companyName: String, $firstName: String, $lastName: String, $phoneNumber: String, $brandEmail: String, $influencerCount: Int, $sessionCount: Int, $countryCodeId: String) {
  createBrandUserRequest(brand_name: $brandName,company_name: $companyName, first_name: $firstName, last_name: $lastName, phone_number: $phoneNumber, brand_email: $brandEmail, influencer_count: $influencerCount, session_count: $sessionCount, country_code_id: $countryCodeId) {
    data {
      uuid
      brand_name
      first_name
      last_name
      phone_number
      country_code_id
      brand_email
      request_status
      influencer_count
      session_count
      created_at
      updated_at
    }
    meta {
      ...MetaFragment
    }
  }
}
`;