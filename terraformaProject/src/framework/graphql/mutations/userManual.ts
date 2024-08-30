import { gql } from '@apollo/client';
export const CREATE_USER_MANUAL = gql`
mutation CreateItemByCategory($itemCategoryData: CreateItemCategoryDto!) {
    createItemByCategory(itemCategoryData: $itemCategoryData) {
      message
      data {
        uuid
        name
        url
        category {
          uuid
          name
          description
          image_url
        }
      }
    }
  }
`;
