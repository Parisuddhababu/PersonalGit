import { gql } from '@apollo/client';
export const GET_USER_WITH_STATUS = gql`
  query GetUsersWithStatusForCourse($inputData: GetUserWithStatusForCourseDto!) {
    getUsersWithStatusForCourse(inputData: $inputData) {
      message
      data {
        usersWithStatus {
          uuid
          first_name
          last_name
          user_type
          status
          email
        }
        count
      }
    }
  }
`