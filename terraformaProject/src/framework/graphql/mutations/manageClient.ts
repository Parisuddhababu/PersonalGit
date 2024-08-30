import { gql } from '@apollo/client';

export const UPDATE_CLIENT=gql`
mutation UpdateClientDetailsForWebsite($inputData: UpdateLandingPageClientDto!) {
    updateClientDetailsForWebsite(inputData: $inputData) {
      message
    }
  }`