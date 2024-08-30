import { gql } from '@apollo/client';

export const UPDATE_SERVICES=gql`
mutation UpdateStepDetailsForWebsite($inputData: UpdateLandingPageStepDto!) {
    updateStepDetailsForWebsite(inputData: $inputData) {
      message
    }
  }`