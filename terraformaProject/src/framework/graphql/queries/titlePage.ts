import { gql } from '@apollo/client';
export const GET_TITLE_WEBSITE = gql`
query GetTitleForWebsite {
    getTitleForWebsite {
      message
      data {
        uuid
        title
      }
    }
  }`
export const GET_SUBTITLE_WEBSITE = gql`
  query GetSubtitleForWebsite {
    getSubtitleForWebsite {
      message
      data {
        uuid
        title
      }
    }
  }`