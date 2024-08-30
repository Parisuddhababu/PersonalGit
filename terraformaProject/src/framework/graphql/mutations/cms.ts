import { gql } from '@apollo/client';

export const DELETE_CMS = gql `
mutation DeletePage($deletePageId: ID) {
    deletePage(id: $deletePageId) {
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

export const CREATE_PAGE = gql `
mutation CreatePage($titleEnglish: String, $descriptionEnglish: String, $metaTitleEnglish: String, $metaDescriptionEnglish: String, $status: Int) {
  createPage(title_english: $titleEnglish, description_english: $descriptionEnglish, meta_title_english: $metaTitleEnglish, meta_description_english: $metaDescriptionEnglish, status: $status) {
    data {
      title_english
      description_english
      meta_title_english
      meta_description_english
      status
      created_at
      updated_at
      id
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


export const GET_CMS_BY_ID = gql `
query GetSinglePage($getSinglePageId: ID) {
  getSinglePage(id: $getSinglePageId) {
    data {
      title_english
      description_english
      meta_title_english
      meta_description_english
      status
      created_at
      updated_at
      id
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

export const UPDATE_CMS = gql `
mutation UpdatePage($titleEnglish: String, $descriptionEnglish: String, $metaTitleEnglish: String, $metaDescriptionEnglish: String, $status: Int, $updatePageId: ID) {
  updatePage(title_english: $titleEnglish, description_english: $descriptionEnglish, meta_title_english: $metaTitleEnglish, meta_description_english: $metaDescriptionEnglish, status: $status, id: $updatePageId) {
    data {
      title_english
      description_english
      meta_title_english
      meta_description_english
      status
      created_at
      updated_at
      id
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
export const GRP_DEL_PAGES=gql`
mutation GroupDeletePages($groupDeletePagesId: [Int]) {
  groupDeletePages(id: $groupDeletePagesId) {
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

export const CHANGESTATUS_CMS=gql`
mutation UpdatePage($status: Int, $updatePageId: ID) {
  updatePage(status: $status, id: $updatePageId) {
    data {
      title_english
      description_english
      meta_title_english
      meta_description_english
      status
      created_at
      updated_at
      id
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