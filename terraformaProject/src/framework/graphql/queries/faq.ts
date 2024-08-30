import { gql } from '@apollo/client'

export const GET_FAQS_DATA = gql`
query fetchFaq($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
    faqs(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        faqData {
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
        count
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
export const GET_FETCHTOPICS_DATA = gql`
query FaqTopics {
  faqTopics {
    data {
      id
      name
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
export const GET_FAQBYID_DATA = gql`
query Faq($faqId: Int) {
  faq(id: $faqId) {
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
export const GET_FAQ_TOPICS_BY_ID=gql`
query FaqTopic($faqTopicId: Int) {
  faqTopic(id: $faqTopicId) {
    data {
      id
      name
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
export const GET_FAQ_TOPICS=gql`
query FaqTopics {
  faqTopics {
    data {
      id
      name
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
