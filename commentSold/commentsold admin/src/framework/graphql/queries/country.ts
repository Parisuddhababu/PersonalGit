import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';

export const GET_COUNTRIES = gql`
${META_FRAGMENT}
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
    meta {...MetaFragment}
  }
}
`;