import { gql } from '@apollo/client';

export const FETCH_ARCHIVES_AND_DRAFT = gql`query GetDraftAndArchiveCourses($courseFlag: GetCourseDto!) {
  getDraftAndArchiveCourses(course_flag: $courseFlag) {
    message
    data {
      courses {
        uuid
        title
        subtitle
        description
        estimate_time
        is_certification
        prerequisite
        course_image
        banner_image
        instructor_profile
        instructor_name
        instructor_qualification
      }
      count
    }
  }
}`;