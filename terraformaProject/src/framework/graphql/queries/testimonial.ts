import { gql } from '@apollo/client';

export const UPDATE_TESTIMONIAL = gql`
mutation UpdateTestimonialDetailsForWebsite($inputData: UpdateLandingPageTestimonialDto!) {
    updateTestimonialDetailsForWebsite(inputData: $inputData) {
      message
    }
  }`

export const UPDATE_TESTIMONIAL_POINT = gql`
mutation UpdateTestimonialPointForWebsite($inputData: UpdateLandingPageTestimonialPointDto!) {
    updateTestimonialPointForWebsite(inputData: $inputData) {
      message
    }
  }`

export const ADD_TESTIMONIAL_POINT = gql`
mutation AddTestimonialPointForWebsite($inputData: AddLandingPageTestimonialPointDto!) {
  addTestimonialPointForWebsite(inputData: $inputData) {
      message
    }
  }`

export const DELETE_TESTIMONIAL_POINT = gql`
mutation DeleteTestimonialPointForWebsite($deleteIds: [String!]!) {
  deleteTestimonialPointForWebsite(delete_ids: $deleteIds) {
    message
  }
}
`