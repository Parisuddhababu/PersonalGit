import { gql } from '@apollo/client';

export const GET_COMPANY_CONTRACTOR_USERS= gql`query GetCompanyContractorUsers($companyId: String!, $locationId: String!) {
    getCompanyContractorUsers(companyId: $companyId, locationId: $locationId) {
      message
      data {
        first_name
        last_name
        uuid
        user_type
      }
    }
  }`;

export const GET_ALL_DIVERSION_TEMPLATE= gql`query GetAllDiversionTemplates($locationId: String!) {
  getAllDiversionTemplates(locationId: $locationId) {
      message
       data {
        equipment {
          name
          uuid
        }
        is_equipment_updated
        is_material_type_updated
        is_material_updated
        is_service_type_updated
        is_volume_updated
        location {
          location
          uuid
        }
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
        subscriber {
          uuid
        }
        volume {
          uuid
          volume
          volume_cubic_yard
        }
        uuid
      }
    }
  }
  `;
export const GET_ALL_DIVERSION_CONTRACTORS_SERVICES = gql`query GetAllDiversionContractorServices($companyId: String!, $limit: Float!, $page: Float!, $locationId: String!) {
  getAllDiversionContractorServices(companyId: $companyId,  limit: $limit, page: $page, locationId: $locationId) {
    message
    data {
      count
      contractorServices {
          add_units
      contractor_company {
        name
        uuid
      }
     diversion_report_template {
        equipment {
          name
          uuid
        }
        material {
          uuid
          name
        }
        material_type {
          uuid
          type
          weight
        }
        service_type
        volume {
          uuid
          volume
          volume_cubic_yard
        }
        uuid
      }
      frequency {
        uuid
        frequency_type
        frequency
      }
      location {
        location
        uuid
      }
      subscriber {
        uuid
      }
      user {
        first_name
        last_name
        uuid
      }
      zone {
        location
        uuid
      }
      uuid
      is_full_site
      }
    }
  }
}

`;