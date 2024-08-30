import { gql } from '@apollo/client';

export const LIST_ABOUT_COURSE = gql`
query GetLearnAboutCoursesForWebsite {
    getLearnAboutCoursesForWebsite {
      message
      data {
        uuid
        title
        description
        image
        order
        type
        landing_page_points {
          uuid
          title
          order
          type
        }   
      }
    }
  }`