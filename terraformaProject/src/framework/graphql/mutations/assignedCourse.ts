import { gql } from '@apollo/client';
export const ASSIGN_COURSE = gql`
  mutation AssignUserCourse($userCourseData: CreateUsersCourseAssignDto!) {
    assignUserCourse(userCourseData: $userCourseData) {
      message
      data {
        uuid
        reward_point
        is_course_completed
        completed_date
      }
    }
  }
`