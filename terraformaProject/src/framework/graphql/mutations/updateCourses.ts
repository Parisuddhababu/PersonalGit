import { gql } from '@apollo/client';

export const DELETE_CHAPTERS = gql`
  mutation DeleteChapters($chapterIds: [String!]!) {
    deleteChapters(chapterIds: $chapterIds) {
      message
    }
  }
`

export const DELETE_LESSONS = gql`
  mutation DeleteLessons($lessonIds: [String!]!) {
    deleteLessons(lessonIds: $lessonIds) {
      message
    }
  }
`

export const DELETE_FAQS = gql`
  mutation DeleteFaqs($faqIds: [String!]!) {
    deleteFaqs(faqIds: $faqIds) {
      message
    }
  }
`

export const DELETE_QUIZ_QUESTIONS = gql`
  mutation DeleteCourseQuizQuestions($quizQuestionIds: [String!]!) {
    deleteCourseQuizQuestions(quizQuestionIds: $quizQuestionIds) {
      message
    }
  }
`

export const USER_QUIZ_CREATED_BY_ID = gql`
  mutation UserQuizCreatedById($courseId: String!) {
    userQuizCreatedById(courseId: $courseId) {
      message
      data {
        uuid
        is_pass
        user_percentage
        passing_mark
        total_questions
        right_answers
        time_taken
        is_show_correct_ans
        certification_generate
        userQuizDetails {
          courseQuizQuestionOptions {
            is_correct
            option
            order
            uuid
          }
          is_right
          question
          selectedOption
          uuid
        }
      }
    }
  }
`

export const FETCH_COURSE_PROGRESS_CHAPTERS = gql`query GetUserCourseProgress($view_as_learner: Boolean!, $courseId: String!) {
  getUserCourseProgress(view_as_learner: $view_as_learner, courseId: $courseId) {
    message
    data {
      chaptersData {
        uuid
        title
        type
        order
        user_course_progress {
          video_last_check_time
          is_chapter_completed
        }
      }
      percentage
      is_show_certification_tab
    }
  }
}`