import { gql } from '@graphcommerce/graphql'

const EDIT_ADDRESS = gql`
  mutation UpdateCustomerAddress(
    $id: Int!
    $prefix: String
    $firstname: String
    $middlename: String
    $lastname: String
    $suffix: String
    $telephone: String
    $street: String!
    $addition: String
    $city: String
    $postcode: String
    $region: CustomerAddressRegionInput
    $company: String
    $countryCode: CountryCodeEnum
    $defaultBilling: Boolean
    $defaultShipping: Boolean
  ) {
    updateCustomerAddress(
      id: $id
      input: {
        prefix: $prefix
        firstname: $firstname
        middlename: $middlename
        lastname: $lastname
        telephone: $telephone
        suffix: $suffix
        street: [$street, $addition]
        city: $city
        postcode: $postcode
        region: $region
        company: $company
        country_code: $countryCode
        default_billing: $defaultBilling
        default_shipping: $defaultShipping
      }
    ) {
      id
    }
  }
`
export default EDIT_ADDRESS
