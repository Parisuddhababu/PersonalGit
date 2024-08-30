import { gql } from '@apollo/client';

export const CREATE_DIVERSION_CONTRACTOR_SERVICE = gql`mutation CreateDiversionContractorService($serviceData: [CreateDiversionContractorServiceDto!]!) {
    createDiversionContractorService(serviceData: $serviceData) {
      message
    }
  }`;
  
export const DELETE_DIVERSION_CONTRACTOR_SERVICE = gql`mutation DeleteDiversionContractorService($serviceId: [String!]!) {
  deleteDiversionContractorService(serviceId: $serviceId) {
    message
  }
}`