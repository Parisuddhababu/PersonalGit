import { gql } from '@apollo/client';

export const SUBMIT_QUIZ = gql`
  mutation SubmitQuiz($quizData: SubmitQuiz!) {
    submitQuiz(quizData: $quizData) {
      message
      data {       
        is_pass
        passing_mark
        user_percentage
        total_questions
        right_answers
        time_taken
        is_show_correct_ans
        certification_generate
        userQuizDetails {
          uuid
          question
          selectedOption
          is_right
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