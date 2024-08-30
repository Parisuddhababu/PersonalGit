import { gql } from '@apollo/client';

export const DELETE_COUPON_BY_ID = gql`
  mutation Mutation($deleteCouponId: Int) {
    deleteCoupon(id: $deleteCouponId) {
      data {
        id
        uuid
        coupon_name
        coupon_code
        coupon_type
        percentage
        start_time
        expire_time
        applicable
        total_usage
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

export const COUPON_STATUS_CHANGE_BY_ID = gql`
  mutation UpdateCouponStatus($updateCouponStatusId: Int!, $status: Int) {
    updateCouponStatus(id: $updateCouponStatusId, status: $status) {
      data {
        id
        uuid
        coupon_name
        coupon_code
        coupon_type
        percentage
        start_time
        expire_time
        applicable
        total_usage
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
export const UPDATE_COUPON = gql`
  mutation Mutation(
    $updateCouponId: Int
    $couponName: String
    $couponCode: String
    $couponType: Int
    $percentage: Float
    $startTime: Date
    $expireTime: Date
    $isReusable: Int
    $applicable: Int
    $selectedUsers: [Int]
  ) {
    updateCoupon(
      id: $updateCouponId
      coupon_name: $couponName
      coupon_code: $couponCode
      coupon_type: $couponType
      percentage: $percentage
      start_time: $startTime
      expire_time: $expireTime
      is_reusable: $isReusable
      applicable: $applicable
      selected_users: $selectedUsers
    ) {
      data {
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
        selected_users

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
export const CREATE_COUPON = gql`
  mutation Mutation(
    $couponName: String
    $couponCode: String
    $couponType: Int
    $percentage: Float
    $startTime: Date
    $expireTime: Date
    $applicable: Int
    $status: Int
    $createdBy: Int
    $selectedUsers: [Int]
    $isReusable: Int
  ) {
    createCoupon(
      coupon_name: $couponName
      coupon_code: $couponCode
      coupon_type: $couponType
      percentage: $percentage
      start_time: $startTime
      expire_time: $expireTime
      applicable: $applicable
      status: $status
      created_by: $createdBy
      selected_users: $selectedUsers
      is_reusable: $isReusable
    ) {
      data {
        id
        uuid
        coupon_name
        coupon_code
        coupon_type
        percentage
        start_time
        expire_time
        applicable
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

export const GROUP_DELETE_COUPON = gql` mutation GroupDeleteCoupons($groupDeleteCouponsId: [Int]) {
  groupDeleteCoupons(id: $groupDeleteCouponsId) {
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
}`;