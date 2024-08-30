import { gql } from '@apollo/client';

export const UPDATE_SETTINGS=gql`

mutation UpdateSetting($updateSettingId: ID, $siteName: String, $tagLine: String, $supportEmail: String, $contactEmail: String, $contactNoContryId: Int, $contactNo: String, $appLanguage: Int, $address: String, $logo: String, $favicon: String, $status: Int, $updatedBy: Int) {
    updateSetting(id: $updateSettingId, site_name: $siteName, tag_line: $tagLine, support_email: $supportEmail, contact_email: $contactEmail, contact_no_contry_id: $contactNoContryId, contact_no: $contactNo, app_language: $appLanguage, address: $address, logo: $logo, favicon: $favicon, status: $status, updated_by: $updatedBy) {
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
`
export const GET_SETTINGS_BY_ID=gql`
query GetDetail($getDetailId: ID) {
    getDetail(id: $getDetailId) {
      data {
        uuid
        site_name
        tag_line
        support_email
        contact_email
        contact_no_contry_id
        contact_no
        app_language
        address
        logo
        favicon
        status
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
`