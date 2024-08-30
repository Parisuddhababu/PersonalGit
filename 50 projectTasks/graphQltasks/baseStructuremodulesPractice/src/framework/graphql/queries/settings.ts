import { gql } from "@apollo/client";
export const GET_SETTINGS_DATA= gql`
query GetDetail($getDetailId: ID) {
    getDetail(id: $getDetailId) {
      data {
        id
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