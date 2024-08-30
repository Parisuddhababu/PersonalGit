import { gql } from '@apollo/client';

export const GET_FREQUENCY_WITH_PAGINATION = gql`query GetFrequencyWithPagination($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getFrequencyWithPagination(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        frequency {
          uuid
          frequency_type
          frequency
        }
        count
      }
    }
  }`;

export const GET_FREQUENCIES = gql`query GetFrequencies {
    getFrequencies {
      message
      data {
        uuid
        frequency_type
        frequency
      }
    }
  }`;

export const GET_FREQUENCY_BY_ID = gql`  query GetFrequencyById($frequencyId: String!) {
    getFrequencyById(frequencyId: $frequencyId) {
      message
      data {
        uuid
        frequency_type
        frequency
      }
    }
  }`;