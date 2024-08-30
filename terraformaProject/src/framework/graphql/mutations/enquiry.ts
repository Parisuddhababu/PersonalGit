import { gql } from '@apollo/client';

export const UPDATE_ENQUIRY_STATUS = gql `
mutation Mutation($updateStatusId: ID, $status: Int) {
    updateStatus(id: $updateStatusId, status: $status) {
      data {
        id
        Name
        Email
        Subject
        Message
        status
        sendAt
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


  export const CREATE_ENQUIRY = gql `
  mutation Mutation($name: String, $email: String, $subject: String, $message: String, $status: Int) {
    createEnquiry(Name: $name, Email: $email, Subject: $subject, Message: $message, status: $status) {
      data {
        id
        Name
        Email
        Subject
        Message
        status
        sendAt
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

  export const DELETE_ENQUIRY = gql `
  mutation DeleteEnquiry($deleteEnquiryId: ID) {
    deleteEnquiry(id: $deleteEnquiryId) {
      data {
        id
        Name
        Email
        Subject
        Message
        status
        sendAt
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



export const GROUP_DELETE_ENQ=gql`
mutation GroupDeleteEnquiries($groupDeleteEnquiriesId: [Int]) {
  groupDeleteEnquiries(id: $groupDeleteEnquiriesId) {
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