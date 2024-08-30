import { gql } from '@apollo/client';

export const GET_PLAY_QUIZ = gql`
  query GetCourseQuizList($courseId: String!) {
    getCourseQuizList(courseId: $courseId) {
      message
      data {
        uuid
        title
        passing_mark
        time_type
        certification_generate
        is_show_correct_ans
        time_limit
        courseQuizQuestions {
          uuid
          question
          courseQuizQuestionOptions {
            uuid
            option
            is_correct
          }
        }
      }
    }
  }
`