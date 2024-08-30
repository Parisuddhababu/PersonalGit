import { gql } from '@apollo/client';

export const UPDATE_ARCHIVE_STATE = gql`mutation UpdateCourseArchiveState($archive: GetArchiveCourseDto!) {
  updateCourseArchiveState(archive: $archive) {
    message
  }
}`;

export const DELETE_COURSE = gql`mutation DeleteCourse($courseId: String!) {
  deleteCourse(courseId: $courseId) {
    message
  }
}`;


