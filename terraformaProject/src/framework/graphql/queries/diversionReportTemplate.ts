import { gql } from '@apollo/client';

export const GET_DIVERSION_REPORT_TEMPLATE_WITH_PAGINATION =gql`query GetDiversionReportTemplateWithPagination($locationId: String!, $sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!) {
  getDiversionReportTemplateWithPagination(locationId: $locationId, sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page) {
    message
    data {
      diversionReport {
        uuid
        service_type
        is_service_type_updated
        material {
          uuid
          name
        }
        is_material_updated
        material_type {
          uuid
          type
          weight
        }
        is_material_type_updated
        equipment {
          uuid
          name
        }
        is_equipment_updated
        volume {
          uuid
          volume
          volume_cubic_yard
        }
        is_volume_updated
        location {
          uuid
          location
          city
        }
        subscriber {
          uuid
        }
      }
      count
    }
  }
}`;