import { gql } from '@apollo/client'


export const CREATE_REVIEW = gql`
mutation CreateReview($fromUserId: Int, $toUserId: Int, $review: String, $rating: Float) {
  createReview(from_user_id: $fromUserId, to_user_id: $toUserId, review: $review, rating: $rating) {
    data {
      id
      uuid
      from_user_id
      to_user_id
      review
      rating
      status
      created_at
      updated_at
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

export const UPDATE_REVIEW_STATUS = gql`
mutation UpdateStatusReview($updateStatusReviewId: Int, $status: Int) {
  updateStatusReview(id: $updateStatusReviewId, status: $status) {
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

export const DELETE_REVIEW = gql`
mutation DeleteReview($deleteReviewId: Int) {
  deleteReview(id: $deleteReviewId) {
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
export const GROUP_DELETE_REVIEW = gql`
mutation GroupDeleteReviews($groupDeleteReviewsId: [Int]) {
  groupDeleteReviews(id: $groupDeleteReviewsId) {
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










