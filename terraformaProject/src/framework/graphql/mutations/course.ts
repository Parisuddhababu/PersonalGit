import { gql } from '@apollo/client';

export const CREATE_NEW_PLAYLIST = gql`
mutation CreatePlaylist($playlistData: CreatePlaylistDto!) {
    createPlaylist(playlistData: $playlistData) {
        data {
          uuid
          name
        }
        message
    }
  }
`

export const CREATE_NEW_COURSE = gql`
 mutation CourseCreateStepFour($courseData: CreateCourseStepFourDto!) {
  courseCreateStepFour(courseData: $courseData) {
    message
  }
}
`

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($courseData: UpdateCourseDto!) {
    updateCourse(courseData: $courseData) {
      message
      data {
        description
        image
        instructor_name
        instructor_profile
        instructor_qualification
        is_certification
        is_template
        level
        prerequisite
        reward_point
        subtitle
        thumbnails
        title
        total_duration
        uuid
      }
    }
  }
`

export const DELETE_COURSE = gql`
  mutation DeleteCourse($courseId: String!) {
    deleteCourse(courseId: $courseId) {
      message   
    }
  }
`

export const COURSE_CREATE = gql`
mutation CourseCreateStepOne($courseData: CreateCourseDto!) {
  courseCreateStepOne(courseData: $courseData) {
    message
    data {
      uuid
      title
      description
      category {
        name
        uuid
      }
      prerequisite
      course_image
      banner_image
      instructor_profile
      instructor_name
      instructor_qualification
      is_template
      is_draft
      createdAt
      highlights {
        id
        uuid
        name
      }
    }
  }
}`;

export const CREATE_CONTENT_STEP_2 = gql`mutation CourseCreateStepTwo($courseData: CreateCourseStepOneDto!) {
  courseCreateStepTwo(courseData: $courseData) {
    message
    data {
      course_chapters {
        chapter_content {
          image
          uuid
          description
          youtube_url
          pdf_url
        }
        uuid
        title
        type
        order
        user_course_progress {
          uuid
          video_last_check_time
          is_chapter_completed
        }
        chapter_quiz {
          uuid
          question
          order
          type
          quiz_question {
            uuid
            option
            is_correct
            order
          }
        }
      }
      uuid
      is_draft
      category {
        uuid
        name
        description
        status
        image_url
      }
      is_template
    }
  }
}`;

export const CREATE_FAQ_STEP_3 = gql`mutation CourseCreateStepThree($courseData: CreateCourseStepThreeDto!) {
  courseCreateStepThree(courseData: $courseData) {
    message
    data {
      id
      uuid
      question
      answer
      order
    }
  }
}`;


