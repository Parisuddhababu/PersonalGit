import { gql } from '@apollo/client';

export const INTRODUCTORY_PAGE_STATUS = gql`
query ChangeStatusOfIntroductoryPage($userId: String!) {
    changeStatusOfIntroductoryPage(userId: $userId) {
      message
    }
  }`