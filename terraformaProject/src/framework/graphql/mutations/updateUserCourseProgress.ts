import { gql } from '@apollo/client';

export const UPDATE_USER_COURSE_PROGRESS = gql`
  mutation UpdateUserCourseProgress($userCourseProgressData: CreateUserCourseProgressDto!) {
  updateUserCourseProgress(userCourseProgressData: $userCourseProgressData) {
    message
    data {
      percentage
      is_show_certification_tab
    }
  }
}
`

export const ASSIGN_LOGGED_IN_USER_COURSE = gql`
  mutation AssignLoggedInUserCourse($courseId: String!) {
    assignLoggedInUserCourse(courseId: $courseId) {
      message
    }
  }
`