import { gql } from '@apollo/client';

export const CREATE_DIVERSION_REPORT_TEMPLATE = gql`mutation CreateDiversionReportTemplate($diversionReportTemplateData: CreateDiverReportTemplateDto!) {
    createDiversionReportTemplate(diversionReportTemplateData: $diversionReportTemplateData) {
      message
    }
  }`;

export const UPDATE_DIVERSION_REPORT_TEMPLATE= gql`mutation UpdateDiversionReportTemplate($diversionReportTemplateData: UpdateDiversionTemplateDto!) {
    updateDiversionReportTemplate(diversionReportTemplateData: $diversionReportTemplateData) {
      message
    }
  }`;

export const DELETE_DIVERSION_REPORT_TEMPLATE = gql`mutation DeleteDiversionReportTemplate($diversionReportTemplateId: String!) {
    deleteDiversionReportTemplate(diversionReportTemplateId: $diversionReportTemplateId) {
      message
    }
  }`;
export const GET_DIVERSION_REPORT_TRMPLATE_BY_ID =gql`mutation GetDiversionTemplateById($templateId: String!) {
  getDiversionTemplateById(templateId: $templateId) {
    data {
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
  }
}
`;