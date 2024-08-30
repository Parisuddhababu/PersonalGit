import { gql } from '@apollo/client';

export const UPDATE_TITLE = gql`
mutation UpdateTitleForWebsite($inputData: UpdateLandingPageTitleDto!) {
    updateTitleForWebsite(inputData: $inputData) {
      message
    }
  }`

  export const UPDATE_SUBTITLE = gql`
  mutation UpdateSubtitleForWebsite($inputData: UpdateLandingPageSubtitleDto!) {
    updateSubtitleForWebsite(inputData: $inputData) {
      message
    }
  }`