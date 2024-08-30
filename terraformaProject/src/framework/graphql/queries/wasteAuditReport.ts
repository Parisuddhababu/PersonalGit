import { gql } from '@apollo/client';

export const GET_WASTE_AUDIT_REPORT_WITH_PAGINATION = gql`
  query GetWasteAuditReportWithPagination($filterData: WasteAuditReportListDto!) {
    getWasteAuditReportWithPagination(filterData: $filterData) {
      message
      data {
        reports {
          uuid
          title
          date
          attachment
          waste_audit_highlights {
            uuid
            highlight
          }
          performance_current
          performance_potential
          performance_capture_rate
          status
        }
        count
      }
    }
  }
`

export const GET_TENANTS_CONTRACTORS_COMPANIES = gql`
  query GetTenantsContractorsCompanies($companyType: Float!) {
    getTenantsContractorsCompanies(company_type: $companyType) {
      message
      data {
        name
        status
        type
        uuid
        website_url
        description
        attachments
      }
    }
  }
`