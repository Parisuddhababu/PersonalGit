import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const FETCH_PLANS = gql`
${META_FRAGMENT}
query FetchSubscriptionPlans($page: Int, $limit: Int, $sortBy: String, $sortOrder: String) {
  fetchSubscriptionPlans(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
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
        plan_id
        order_no
        status
        created_at
        updated_at
      }
      count_active_subscription
      count
    }
    meta {  ...MetaFragment }
  }
}
`;

export const FETCH_SUBSCRIPTION_PLAN = gql`
${META_FRAGMENT}
query FetchSubscriptionPlan($uuid: UUID) {
  fetchSubscriptionPlan(uuid: $uuid) {
    data {
      uuid
      plan_title
      plan_description
      no_of_sessions
      plan_features {
        name
        isActive
      }
      plan_price
      plan_id
      order_no
      status
      created_at
      updated_at
    }
    meta {  ...MetaFragment }
  }
}
`;

