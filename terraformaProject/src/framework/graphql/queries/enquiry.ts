import { gql } from '@apollo/client';

export const GET_ENQUIRY = gql `
query FetchEnquiry($page: Int, $limit: Int, $name: String, $email: String, $status: Int, $sortBy: String, $sortOrder: String) {
    fetchEnquiry(page: $page, limit: $limit, Name: $name, Email: $email, status: $status, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        Enquirydata {
          id
          Name
          Email
          Subject
          Message
          status
          sendAt
        }
        count
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
  }`





