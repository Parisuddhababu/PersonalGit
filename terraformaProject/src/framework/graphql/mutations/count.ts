import { gql } from '@apollo/client';

export const UPDATE_COUNT=gql`
mutation UpdateStatisticDetailsForWebsite($inputData: UpdateLandingPageStatisticDto!) {
  updateStatisticDetailsForWebsite(inputData: $inputData) {
    message
   
  }
}`