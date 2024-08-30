import { gql } from '@apollo/client';

export const GET_USER_COURSE_COUNT_DETAILS = gql`
  query UsersDashboardCountDetails {
  usersDashboardCountDetails {
    message
    data {
      no_of_courses_completed
      no_of_courses_in_progress
      no_of_remaining_assigned_courses
      total_certificates_earned
    }
  }
}
`

export const GET_USER_COURSES_IN_PROGRESS_AND_ASSIGNED = gql`
  query GetUserCoursesInProgressOrAssigned($inputData: GetUserCoursesDto!) {
  getUserCoursesInProgressOrAssigned(inputData: $inputData) {
    message
    data {
      courses {
        uuid
        title
        subtitle
        description
        is_certification
        prerequisite
        instructor_profile
        instructor_name
        instructor_qualification
        course_image
        banner_image
        is_template
        is_editable
        estimate_time
        percentage
        category {
          uuid
          name
          description
          status
          image_url
        }
        created_by {
          uuid
          email
          first_name
          last_name
          user_type
        }
        totalChapters
        chaptersCompleted
      }
      count
    }
  }
}
`