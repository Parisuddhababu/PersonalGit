import { gql } from '@apollo/client';

export const GET_MATERIAL_WITH_PAGINATION = gql`query GetMaterialsWithPagination($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getMaterialsWithPagination(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        materials {
          uuid
          name
          material_types {
            uuid
            type
            weight
          }
        }
        count
      }
    }
  }`;

export const GET_MATERIALS = gql`query GetMaterials {
    getMaterials {
      message
      data {
        uuid
        name
        material_types {
          uuid
          type
          weight
        }
      }
    }
  }`;

  export const GET_MATERIAL_BY_ID = gql`query GetMaterialById($materialId: String!) {
    getMaterialById(materialId: $materialId) {
      message
      data {
        uuid
        name
        material_types {
          uuid
          type
          weight
        }
        id
      }
    }
  }`;
  
