import { gql } from '@apollo/client';


export const FETCH_LEARNERS=gql`query GetUsersWithStatusForCourse($inputData: GetUserWithStatusForCourseDto!) {
    getUsersWithStatusForCourse(inputData: $inputData) {
      message
      data {
        data {
          user_uuid
          first_name
          last_name
          user_type
          status
          subscriber_branch_name
        }
        count
      }
    }
  }`;

  