import { gql } from '@apollo/client';

export const CREATE_OR_UPDATE_WEIGHTS =gql`mutation CreateDiversionReport($reportData: [CreateDiversionReportDto!]!, $isSubmitted: Boolean!) {
    createDiversionReport(reportData: $reportData, is_submitted: $isSubmitted) {
      message
    }
  }`;