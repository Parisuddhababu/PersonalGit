import { gql } from '@apollo/client';

export const GET_DIVERSION_HISTORY = gql`query GetDiversionReportHistory($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!, $locationId: String!) {
    getDiversionReportHistory(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search, locationId: $locationId) {
      message
      data {
        count
        diversionReportHistory {
          contractor_company {
            name
            uuid
          }
          location {
            location
            uuid
          }
          subscriber {
            uuid
          }
          title
          start_date
          end_date
          frequency
          uuid
        }
      }
    }
  }`;

export const GET_DIVERSION_HISTORY_BY_HISTORY_ID= gql`query GetDiversionReportsByHistoryId($historyId: String!) {
  getDiversionReportsByHistoryId(historyId: $historyId) {
    message
    data {
      user {
        first_name
        last_name
        uuid
      }
      subscriber {
        uuid
      }
      start_date
      end_date
      location {
        uuid
        location
      }
      invoice
      frequency_time
      document
      contractor_company {
        name
        uuid
      }
      services {
        uuid
        add_units
        approx_weight_per_month
        approx_weight_per_unit
        is_approx_weight_per_month_updated
        equipment {
          uuid
          name
        }
        frequency {
          uuid
          frequency_type
          frequency
        }
        is_full_site
        is_submitted
        lift {
          uuid
          name
          date
          weight
        }
        lifts
        material {
          name
          uuid
        }
        material_type {
          uuid
          type
          weight
        }
        service_type
        zone {
          uuid
          location
        }
        volume {
          uuid
          volume
          volume_cubic_yard
        }
      }
    }
  }
}`;

export const GET_CONTRACTOR_COMPANY_LIST = gql`query GetCompaniesByLocationId($companyType: Float!, $locationId: String!) {
  getCompaniesByLocationId(company_type: $companyType, locationId: $locationId) {
    message
    data {
      name
      uuid
      description
      status
    }
  }
}`;

export const GET_DIVERSION_HISTORY_BY_ID = gql`query GetDiversionHistoryById($historyId: String!) {
  getDiversionHistoryById(historyId: $historyId) {
    message
    data {
      start_date
      end_date
      frequency
      title
      subscriber {
        uuid
      }
      location {
        uuid
        location
        city
      }
    }
  }
}`
