import { gql } from '@apollo/client';

export const UPDATE_SUBSCRIPTION_PLAN = gql`
mutation UpdateSubscriptionPlanDetailsForWebsite($inputData: UpdateLandingPageSubscriptionPlanDto!) {
    updateSubscriptionPlanDetailsForWebsite(inputData: $inputData) {
      message
    }
  }`