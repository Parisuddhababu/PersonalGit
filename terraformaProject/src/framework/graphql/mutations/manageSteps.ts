import { gql } from '@apollo/client';
export const UPDATE_STEPS = gql`
mutation UpdateStepDetailsForWebsite($inputData: UpdateLandingPageStepDto!) {
    updateStepDetailsForWebsite(inputData: $inputData) {
      message
    }
  }`