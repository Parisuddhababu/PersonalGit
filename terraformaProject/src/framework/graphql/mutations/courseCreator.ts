import { gql } from '@apollo/client'; 

export const CREATE_COURSE_CREATOR = gql`mutation CourseCreatorCreate($courseCreatorData: CreateCourseCreatorDto!) {
  courseCreatorCreate(courseCreatorData: $courseCreatorData) {
    message
  }
}`;

export const UPDATE_COURSE_CREATOR=gql`mutation UpdateCourseCreator($courseData: UpdatedCreateCourseCreatorDto!) {
  updateCourseCreator(courseData: $courseData) {
    message
  }
}`;

export const DELETE_CREATOR = gql`mutation CourseCreatorUserDelete($userId: String!) {
  courseCreatorUserDelete(userId: $userId) {
    message
  }
}`;