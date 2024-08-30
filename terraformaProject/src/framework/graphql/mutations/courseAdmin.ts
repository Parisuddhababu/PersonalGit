import { gql } from '@apollo/client';

export const CREATE_COURSE_ADMIN=gql`mutation CreateCourseAdministrator($courseAdministratorData: CreateCourseAdministratorDto!) {
  createCourseAdministrator(courseAdministratorData: $courseAdministratorData) {
    message
  }
}`;

export const UPDATE_COURSE_ADMIN=gql`mutation UpdateCourseAdministrator($courseData: UpdatedCreateCourseAdministratorDto!) {
  updateCourseAdministrator(courseData: $courseData) {
    message
  }
}`;

export const DELETE_COURSE_ADMIN=gql`mutation DeleteCourseAdministrator($courseAdministratorIds: [String!]!) {
  deleteCourseAdministrator(courseAdministratorIds: $courseAdministratorIds) {
    message
  }
}`;

export const DELETE_COURSE_ADMIN_RECORD = gql`mutation CourseAdminDelete($userId: String!) {
  courseAdminDelete(userId: $userId) {
    message
  }
}`