import { gql } from '@apollo/client';

export const GET_EQUIPMENT_WITH_PAGINATION = gql`query GetEquipmentsWithPagination($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getEquipmentsWithPagination(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        equipments {
          uuid
          name
          volume {
            uuid
            volume
            volume_cubic_yard
          }
        }
        count
      }
    }
  }`;

  export const GET_EQUIPMENTS = gql`query GetEquipments {
    getEquipments {
      message
      data {
        uuid
        name
        volume {
          uuid
          volume
          volume_cubic_yard
        }
      }
    }
  }`;