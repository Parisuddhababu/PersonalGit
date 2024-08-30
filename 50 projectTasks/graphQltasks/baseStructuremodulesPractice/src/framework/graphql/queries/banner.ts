import { gql } from "@apollo/client";

export const GET_BANNER_DETAILS = gql`
  query FetchBanner(
    $page: Int
    $limit: Int
    $bannerTitle: String
    $createdBy: String
    $status: Int
    $sortBy: String
    $sortOrder: String
  ) {
    fetchBanner(
      page: $page
      limit: $limit
      banner_title: $bannerTitle
      created_by: $createdBy
      status: $status
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      data {
        BannerData {
          id
          banner_title
          banner_image
          status
          created_by
          created_at
          updated_at
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
            device_type
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
`;

export const GET_BANNER_DETAILS_BY_ID=gql`
query GetBannerDetail($getBannerDetailId: ID) {
  getBannerDetail(id: $getBannerDetailId) {
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
