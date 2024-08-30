import { gql } from '@graphcommerce/graphql'

const ADD_ADDRESS = gql`
  mutation CreateCustomerAddress(
    $firstname: String!
    $middlename: String
    $lastname: String!
    $suffix: String
    $telephone: String!
    $street: String!
    $addition: String
    $city: String!
    $postcode: String!
    $region: CustomerAddressRegionInput!
    $company: String
    $countryCode: CountryCodeEnum!
    $defaultBilling: Boolean = false
    $defaultShipping: Boolean = false
  ) {
    createCustomerAddress(
      input: {
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
export default ADD_ADDRESS
