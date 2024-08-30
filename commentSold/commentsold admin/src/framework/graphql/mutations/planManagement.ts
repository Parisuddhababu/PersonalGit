import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';

export const DELETE_SUBSCRIPTION_PLAN = gql`
${META_FRAGMENT}
mutation DeleteSubscriptionPlan($uuid: UUID) {
    deleteSubscriptionPlan(uuid: $uuid) {
        meta {  ...MetaFragment }
    }
  }
`;

export const CREATE_SUBSCRIPTION_PLAN = gql`
${META_FRAGMENT}
mutation CreateSubscriptionPlan($planTitle: String, $planDescription: String, $noOfSessions: Int, $planFeatures: [PlanFeatureInput], $planPrice: Float) {
  createSubscriptionPlan(plan_title: $planTitle, plan_description: $planDescription, no_of_sessions: $noOfSessions, plan_features: $planFeatures, plan_price: $planPrice) {
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
      order_no
      status
      created_at
      updated_at
    }
    meta {  ...MetaFragment }
  }
}
`;

export const UPDATE_SUBSCRIPTION_PLAN = gql`
${META_FRAGMENT}
mutation UpdateSubscriptionPlan($uuid: UUID, $planTitle: String, $planDescription: String, $noOfSessions: Int, $planFeatures: [PlanFeatureInput], $planPrice: Float, $orderNo: Int, $status: UserStatus) {
  updateSubscriptionPlan(uuid: $uuid, plan_title: $planTitle, plan_description: $planDescription, no_of_sessions: $noOfSessions, plan_features: $planFeatures, plan_price: $planPrice, order_no: $orderNo, status: $status) {
    meta {  ...MetaFragment }
  }
}
`;