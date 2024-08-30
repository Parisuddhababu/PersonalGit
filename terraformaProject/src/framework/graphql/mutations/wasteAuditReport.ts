import { gql } from '@apollo/client';

export const CREATE_WASTE_AUDIT_REPORT = gql`
  mutation CreateWasteAuditReport($wasteAuditData: CreateWasteAuditReport!) {
    createWasteAuditReport(wasteAuditData: $wasteAuditData) {
      message
      data {
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
    }
  }
`

export const DELETE_WASTE_AUDIT_REPORT = gql`
  mutation DeleteWasteAuditReport($reportId: String!) {
    deleteWasteAuditReport(reportId: $reportId) {
      message
    }
  }
`

export const CREATE_WASTE_AUDIT_REPORT_REQUEST = gql`
  mutation CreateWasteAuditReportRequest($wasteAuditData: WasteAuditReportRequestDto!) {
    createWasteAuditReportRequest(wasteAuditData: $wasteAuditData) {
      message
    }
  }
`
