import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_CONTACTS_LIST = gql`
${META_FRAGMENT}
query FetchContactUs($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
    fetchContactUs(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        ContactUsData {
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
        count
      }
      meta {...MetaFragment}
    }
  }
`