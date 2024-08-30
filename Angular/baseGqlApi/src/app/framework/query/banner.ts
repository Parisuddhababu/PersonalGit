import { gql } from 'apollo-angular';

export const fetchBanner = gql`
 query FetchBanner($page: Int, $limit: Int, $bannerTitle: String, $bannerTitleArabic: String, $createdBy: String, $status: Int, $sortBy: String, $sortOrder: String) {
  fetchBanner(page: $page, limit: $limit, banner_title: $bannerTitle, banner_title_arabic: $bannerTitleArabic, created_by: $createdBy, status: $status, sortBy: $sortBy, sortOrder: $sortOrder) {
    data {
      BannerData {
        id
        uuid
        banner_title
        banner_title_arabic
        banner_image
        status
        created_by
        created_at
        updated_at
        filePath {
          original_file
          image_200
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
          user_type
          profile_img
          device_type
          device_token
          status
          created_at
          updated_at
          serialNo
        }
        serialNo
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

export const GetBanner = gql`
  query GetBannerDetail($uuid: UUID) {
    getBannerDetail(uuid: $uuid) {
      data {
        id
        uuid
        banner_title
        banner_title_arabic
        banner_image
        status
        created_by
        created_at
        updated_at
        filePath {
          original_file
          image_200
        }
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
