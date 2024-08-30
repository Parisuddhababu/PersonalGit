import { gql } from '@apollo/client';

export const LIST_PLAN = gql`
query GetSubscriptionPlansForWebsite {
    getSubscriptionPlansForWebsite {
      message
      data {
        title
        uuid
        subscription_plans {
          uuid
          name
          price
          order
          tag
          type
          subscription_plan_points {
            uuid
            title
            description
            order
          }
        }
      }
    }
  }`
  