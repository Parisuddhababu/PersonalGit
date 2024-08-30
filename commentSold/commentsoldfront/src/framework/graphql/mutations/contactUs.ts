import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';

export const CREATE_CONTACT_US = gql`
${META_FRAGMENT}
mutation CreateContactUs($firstName: String, $lastName: String, $email: String, $message: String, $phoneNumber: String, $countryCodeId: String) {
  createContactUs(first_name: $firstName, last_name: $lastName, email: $email, message: $message, phone_number: $phoneNumber, country_code_id: $countryCodeId) {
    data {
      uuid
      first_name
      last_name
      email
      message
      phone_number
      country_code_id
      created_at
      updated_at
    }
    meta {
      ...MetaFragment
    }
  }
}
`