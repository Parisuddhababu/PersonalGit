import { gql } from '@apollo/client';

export const ASSIGN_USER_COURSE= gql`mutation AssignUserCourse($userCourseData: CreateUsersCourseAssignDto!) {
    assignUserCourse(userCourseData: $userCourseData) {
      message
    }
  }`;

  