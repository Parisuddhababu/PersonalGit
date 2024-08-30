import { gql } from 'apollo-angular';

export const CreateBanner = gql`
  mutation CreateBanner(
    $bannerTitle: String
    $bannerTitleArabic: String
    $bannerImage: String
    $status: Int
  ) {
    createBanner(
      banner_title: $bannerTitle
      banner_title_arabic: $bannerTitleArabic
      banner_image: $bannerImage
      status: $status
    ) {
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

export const EditBanner = gql`
  mutation UpdateBanner(
    $uuid: UUID
    $bannerTitle: String
    $bannerTitleArabic: String
    $bannerImage: String
    $status: Int
  ) {
    updateBanner(
      uuid: $uuid
      banner_title: $bannerTitle
      banner_title_arabic: $bannerTitleArabic
      banner_image: $bannerImage
      status: $status
    ) {
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

export const DeleteBanner = gql`
  mutation DeleteBanner($uuid: UUID) {
    deleteBanner(uuid: $uuid) {
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

export const BannerStatusChange=gql`
mutation UpdateBannerStatus($uuid: UUID, $status: Int) {
  updateBannerStatus(uuid: $uuid, status: $status) {
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
