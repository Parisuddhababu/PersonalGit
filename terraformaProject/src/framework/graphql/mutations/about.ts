import { gql } from '@apollo/client';

export const UPDATE_ABOUT_US = gql`
mutation UpdateAboutUsDetailsForWebsite($inputData: UpdateLandingPageAboutUsDto!) {
    updateAboutUsDetailsForWebsite(inputData: $inputData) {
      message
     }
  }`

export const UPDATE_ABOUT_US_POINT = gql`
  mutation AddOrUpdateAboutUsPointForWebsite($inputData: UpdateLandingPagePointsDto!) {
    addOrUpdateAboutUsPointForWebsite(inputData: $inputData) {
      message
    }
  }`