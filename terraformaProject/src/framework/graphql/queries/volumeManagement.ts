import { gql } from '@apollo/client';

export const GET_VOLUME_WITH_PAGINATION  = gql`query GetVolumesWithPagination($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getVolumesWithPagination(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        volumes {
          uuid
          volume
          volume_cubic_yard
        }
        count
      }
    }
  }`;

export const GET_VOLUMES = gql`query GetVolumes {
  getVolumes {
    message
    data {
      uuid
      volume
      volume_cubic_yard
    }
  }
}`;

