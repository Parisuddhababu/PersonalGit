import { gql } from '@apollo/client';

export const  UPDATE_ABOUT_COURSE =gql`
mutation UpdateAboutCourseDetailsForWebsite($inputData: UpdateLandingPageAboutCourseDto!) {
    updateAboutCourseDetailsForWebsite(inputData: $inputData) {
      message
    }
  }`
  export const  UPDATE_ABOUT_COURSE_POINT =gql`
  mutation UpdateAboutCoursePointForWebsite($inputData: UpdateLandingPagePointsDto!) {
    updateAboutCoursePointForWebsite(inputData: $inputData) {
      message
    }
  }`