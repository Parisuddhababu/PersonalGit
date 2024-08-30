import { gql } from '@apollo/client';

export const GET_SUGGESTION=gql`
query FetchSuggestion($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $categoryId: Int, $suggestion: String, $createdBy: String, $status: Int) {
  fetchSuggestion(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, category_id: $categoryId, suggestion: $suggestion, created_by: $createdBy, status: $status) {
    data {
      Suggestiondata {
        id
        category_id
        suggestion
        status
        created_by
        created_at
        updated_at
        Category {
          id
          uuid
          category_name
          parent_category
          description
          status
          created_by
          created_at
          updated_at
        }
        User {
          id
          uuid
          first_name
          middle_name
          last_name
          user_name
          email
          gender
          date_of_birth
          phone_no
          phone_country_id
          role
          profile_img
          status
          user_role_id
          created_at
          updated_at
        }
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

export const GET_CATEGORY=gql`
query FetchCategory {
    fetchCategory {
      data {
        Categorydata {
          id
          category_name
         
        }
       
      }
     
    }
  }
`