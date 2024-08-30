import { gql } from '@apollo/client';
export const SUPER_ADMIN_CREATE_NEW_COMPANY = gql`
mutation CreateSuperAdminCompanyDirectory($superAdminCompanyDirectoryData: SuperAdminCompanyDirectoryDto!) {
  createSuperAdminCompanyDirectory(superAdminCompanyDirectoryData: $superAdminCompanyDirectoryData) {
    data {
      uuid
      name
      description
      website_url
      email
      country {
        uuid
        name
        countryCode
        phoneCode
      }
      phone_number
      location
      image_url
    }
    message
  }
}
`
export const SUPER_ADMIN_UPDATE_NEW_COMPANY = gql`
  mutation UpdateSuperAdminCompanyDirectory($companyId: String!, $companyDirectoryData: SuperAdminCompanyDirectoryDto!) {
    updateSuperAdminCompanyDirectory(companyId: $companyId, companyDirectoryData: $companyDirectoryData) {
      message
      data {
        uuid
        name
        description
        website_url
        email
        country {
          uuid
          name
          countryCode
          phoneCode
        }
        phone_number
        image_url
        location
      }
    }
}`;

export const DELETE_NEW_COMPANY = gql`
  mutation DeleteCompanyDirectory($companyId: String!) {
    deleteCompanyDirectory(companyId: $companyId) {
      message
      data {
        uuid
        name
        description        
        email
        country {
          uuid
          name
          countryCode
          phoneCode
        }
        phone_number        
      }
    }
}`
export const COMPANY_DIRECTORY_VOTE = gql`
mutation CreateCompanyDirectoryVote($companyDirectoryId: String!) {
  createCompanyDirectoryVote(companyDirectoryId: $companyDirectoryId) {
    message
    data {
      id
      uuid
      company_directory {
        uuid
        name
        description
        website_url
        email
        country {
          id
          uuid
          name
          countryCode
          phoneCode
        }
        phone_number
      }
    }
  }
}`

export const SUBSCRIBER_ADMIN_CREATE_NEW_COMPANY = gql`
mutation CreateCompanyDirectory($companyDirectoryData: CompanyDirectoryDto!) {
  createCompanyDirectory(companyDirectoryData: $companyDirectoryData) {
    message
    data {
      uuid
      name
      description
      website_url
      email
      country {
        id
        uuid
        name
        countryCode
        phoneCode
      }
      phone_number
    }
  }
}`