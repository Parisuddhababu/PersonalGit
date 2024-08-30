import { gql } from '@apollo/client';

export const FETCH_COUPONS = gql`
  query FetchCoupons(
    $page: Int
    $limit: Int
    $sortBy: String
    $sortOrder: String
    $couponName: String
    $startTime: Date
    $expireTime: Date
    $status: Int
  ) {
    fetchCoupons(
      page: $page
      limit: $limit
      sortBy: $sortBy
      sortOrder: $sortOrder
      coupon_name: $couponName
      start_time: $startTime
      expire_time: $expireTime
      status: $status
    ) {
      data {
        Coupondata {
          id
          uuid
          coupon_name
          coupon_code
          coupon_type
          percentage
          start_time
          expire_time
          applicable
          is_reusable
          total_usage
          selected_users
          status
          created_by
          created_at
          updated_at
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
export const GET_COUPON_BY_ID = gql`
  query GetSingleCoupon($getSingleCouponId: Int) {
    getSingleCoupon(id: $getSingleCouponId) {
      data {
        coupon {
          id
          uuid
          coupon_name
          coupon_code
          coupon_type
          percentage
          start_time
          expire_time
          applicable
          is_reusable
          total_usage
          selected_users
          status
          created_by
          created_at
          updated_at
        }
        userList {
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
