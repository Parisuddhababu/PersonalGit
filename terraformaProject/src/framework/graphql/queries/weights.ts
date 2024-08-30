import { gql } from '@apollo/client';

export const GET_ALL_DIVERSION_REPORTS_CONTRACTORS = gql`query GetAllDiversionReports($companyId: String!, $limit: Float!, $page: Float!) {
  getAllDiversionReports(companyId: $companyId, limit: $limit, page: $page) {
    message
    data {
      diversionReports {
        add_units
        is_material_updated
        is_material_type_updated
        is_equipment_updated
        is_volume_updated
        is_service_type_updated
        approx_weight_per_month
        approx_weight_per_unit
        lifts
        contractor_company {
          uuid
          name
        }
        document
        end_date
        equipment {
          name
          uuid
        }
        frequency {
          uuid
          frequency_type
          frequency
        }
        frequency_time
        invoice
        is_draft
        is_full_site
        is_submitted
        location {
          uuid
          location
        }
        material {
          uuid
          name
        }
        material_type {
          type
          uuid
          weight
        }
        service_type
        start_date
        subscriber {
          uuid
        }
        user {
          first_name
          last_name
          uuid
        }
        volume {
          uuid
          volume
          volume_cubic_yard
        }
        zone {
          location
          uuid
        }
        uuid
        lift {
          uuid
          name
          date
          weight
        }
      }
      count
    }
  }
}`