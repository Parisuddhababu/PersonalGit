import { gql } from '@apollo/client';

export const UPDATE_TAG = gql`
mutation UpdateTag($tagData: UpdateTagsDto!) {
    updateTag(tagData: $tagData) {
      message
    }
  }`