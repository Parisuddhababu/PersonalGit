import { gql } from '@apollo/client'

export const UPDATE_FAQ_STATUS = gql`
mutation ChangeFaqStatus($changeFaqStatusId: Int, $status: Int) {
    changeFaqStatus(id: $changeFaqStatusId, status: $status) {
      data {
        id
        topic_id
        question_english
        question_arabic
        question_hindi
        answer_english
        answer_arabic
        answer_hindi
        status
        createdAt
        updatedAt
      }
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
    }
  }
`

export const DELETE_FAQ = gql`
mutation DeleteFaq($deleteFaqId: Int) {
    deleteFaq(id: $deleteFaqId) {
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
    }
  }
`


export const UPDATE_FAQ_DATA=gql`
mutation Mutation($updateFaqId: Int, $topicId: Int, $questionArabic: String, $questionEnglish: String, $questionHindi: String, $answerEnglish: String, $answerArabic: String, $answerHindi: String, $status: Int) {
  updateFaq(id: $updateFaqId, topic_id: $topicId, question_arabic: $questionArabic, question_english: $questionEnglish, question_hindi: $questionHindi, answer_english: $answerEnglish, answer_arabic: $answerArabic, answer_hindi: $answerHindi, status: $status) {
    data {
      id
      topic_id
      question_english
      question_arabic
      question_hindi
      answer_english
      answer_arabic
      answer_hindi
      status
      createdAt
      updatedAt
    }
    meta {
      message
      messageCode
      statusCode
      status
      type
      errors {
        errorField
        error
      }
      errorType
    }
  }
}
`
export const CREATE_FAQ_MUTATION = gql`
mutation CreateFaq(
  $topicId: Int
  $questionEnglish: String
  $questionArabic: String
  $questionHindi: String
  $answerEnglish: String
  $answerArabic: String
  $answerHindi: String
  $status: Int
) {
  createFaq(
    topic_id: $topicId
    question_english: $questionEnglish
    question_arabic: $questionArabic
    question_hindi: $questionHindi
    answer_english: $answerEnglish
    answer_arabic: $answerArabic
    answer_hindi: $answerHindi
    status: $status
  ) {
    data {
      id
      topic_id
      question_english
      question_arabic
      question_hindi
      answer_english
      answer_arabic
      answer_hindi
      status
      createdAt
      updatedAt
    }
    meta {
      message
      messageCode
      statusCode
      status
      type
      errors {
        errorField
        error
      }
      errorType
    }
  }
}
`;

export const GRP_DEL_FAQ=gql`
mutation GroupDeleteFaqs($groupDeleteFaqsId: [Int]) {
  groupDeleteFaqs(id: $groupDeleteFaqsId) {
    meta {
      message
      messageCode
      statusCode
      status
      type
      errors {
        errorField
        error
      }
      errorType
    }
  }
}
`

