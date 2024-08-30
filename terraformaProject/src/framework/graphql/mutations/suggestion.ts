import { gql } from '@apollo/client';

export const CREATE_SUGGESTION=gql`
mutation CreateSuggestion($categoryId: Int!, $suggestion: String!, $status: Int, $createdBy: Int) {
    createSuggestion(category_id: $categoryId, suggestion: $suggestion, status: $status, created_by: $createdBy) {
      data {
        id
        category_id
        suggestion
        status
        created_by
        created_at
        updated_at
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

export const DELETE_SUGGESTION=gql`
mutation DeleteSuggestion($deleteSuggestionId: Int) {
    deleteSuggestion(id: $deleteSuggestionId) {
      data {
        id
        category_id
        suggestion
        status
        created_by
        created_at
        updated_at
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

export const UDPATE_SUGGESTION_STATUS=gql`
mutation Mutation($suggestionStatusUpdateId: Int, $status: Int, $note: String) {
    suggestionStatusUpdate(id: $suggestionStatusUpdateId, status: $status, note: $note) {
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

export const GRP_DELETE_SUGGESTION=gql`
mutation GroupDeleteSuggestions($groupDeleteSuggestionsId: [Int]) {
  groupDeleteSuggestions(id: $groupDeleteSuggestionsId) {
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
export const GROUP_DELETE_SUGGESTION=gql`
mutation GroupDeleteSuggestions($groupDeleteSuggestionsId: [Int]) {
  groupDeleteSuggestions(id: $groupDeleteSuggestionsId) {
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