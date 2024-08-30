import { gql } from '@apollo/client';
export const WHY_CHOOSE_US = gql`
mutation UpdateWhyChooseUsDetailsForWebsite($inputData: UpdateLandingPageWhyChooseUsDto!) {
    updateWhyChooseUsDetailsForWebsite(inputData: $inputData) {
      message
    }
  }`