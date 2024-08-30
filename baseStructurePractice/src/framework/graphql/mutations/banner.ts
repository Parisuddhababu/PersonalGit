import {gql} from "@apollo/client";

export const CHANGE_BANNER_STATUS=gql`
mutation UpdateBannerStatus($updateBannerStatusId: ID, $status: Int) {
    updateBannerStatus(id: $updateBannerStatusId, status: $status) {
      data {
        id
        banner_title
        banner_image
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
`;

export const CREATE_BANNER=gql`
mutation CreateBanner($bannerTitle: String, $bannerImage: String, $createdBy: Int, $status: Int) {
  createBanner(banner_title: $bannerTitle, banner_image: $bannerImage, created_by: $createdBy, status: $status) {
    data {
      id
      banner_title
      banner_image
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
}`

export const UPDATE_BANNER=gql`
mutation UpdateBanner($updateBannerId: ID, $bannerTitle: String, $bannerImage: String, $status: Int) {
  updateBanner(id: $updateBannerId, banner_title: $bannerTitle, banner_image: $bannerImage, status: $status) {
    data {
      id
      banner_title
      banner_image
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
export const DELETE_BANNER=gql`
mutation DeleteBanner($deleteBannerId: ID) {
  deleteBanner(id: $deleteBannerId) {
    data {
      id
      banner_title
      banner_image
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

export  const GROUP_DELETE_BANNER=gql`
mutation GroupDeleteBanner($groupDeleteBannerId: [Int]) {
  groupDeleteBanner(id: $groupDeleteBannerId) {
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