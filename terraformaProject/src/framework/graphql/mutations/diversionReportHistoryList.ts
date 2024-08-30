import { gql } from '@apollo/client';

export const DELETE_DIVERSION_REPORT = gql`mutation DeleteDiversionReport($reportId: [String!]!) {
    deleteDiversionReport(reportId: $reportId) {
      message
    }
  }`