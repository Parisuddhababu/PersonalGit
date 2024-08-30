import { gql } from '@apollo/client'



export const GET_REVIEW_DATA = gql`
query FetchReviews($page: Int, $search: String, $limit: Int) {
  fetchReviews(page: $page, search: $search, limit: $limit) {
    data {
      responseData {
        id
        uuid
        from_user_id
        to_user_id
        review
        rating
        status
        created_at
        updated_at
        from_user {
          id
          uuid
          first_name
          middle_name
          last_name
          email
          gender
          phone_no
          phone_country_id
          role
          profile_img
          status
          user_role_id
        }
        to_user {
          id
          uuid
          first_name
          middle_name
          last_name
          email
          gender
          phone_no
          phone_country_id
          role
          profile_img
          status
          user_role_id
        }
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
}
`
export const GET_ALLUSER_DATA = gql`
query GetUsers {
  getUsers {
    data {
      userList {
        id
        uuid
        first_name
        middle_name
        last_name
        email
        gender
        phone_no
        phone_country_id
        role
        profile_img
        status
        user_role_id
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
}
`

