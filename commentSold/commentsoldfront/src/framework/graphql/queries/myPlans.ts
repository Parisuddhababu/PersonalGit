import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const FETCH_SUBSCRIPTION_PLANS = gql`
  ${META_FRAGMENT}
  query FetchSubscriptionPlans {
    fetchSubscriptionPlans {
      data {
        subscriptionPlanData {
          uuid
          plan_title
          plan_description
          no_of_sessions
          plan_features {
            name
            isActive
          }
          plan_price
          order_no
          status
          created_at
          updated_at
        }
        count
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const FETCH_PAYMENT_HISTORY = gql`
  ${META_FRAGMENT}
  query FetchPaymentHistory(
    $sortOrder: String
    $sortBy: String
    $limit: Int
    $page: Int
  ) {
    fetchPaymentHistory(
      sortOrder: $sortOrder
      sortBy: $sortBy
      limit: $limit
      page: $page
    ) {
      data {
        PaymentHistoryDate {
          uuid
          purchased_price
          invoice_pdf
          status
          created_at
        }
        count
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const FETCH_USER_MY_PLAN_DETAILS = gql`
  ${META_FRAGMENT}
  query FetchUserMyPlanDetails {
    fetchUserMyPlanDetails {
      data {
        current_user_plan_details {
          current_subscription_purchased_price
          available_session
          status
          plan_title
          plan_description
        }
        completed_session
        total_purchased_session
        plan_title
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;
