import { gql } from '@apollo/client';

export const FETCH_PAGES = gql `
query FetchPages($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
  fetchPages(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
    data {
      ContentData {
        title_english
        description_english
        meta_title_english
        meta_description_english
        status
        created_at
        updated_at
        id
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