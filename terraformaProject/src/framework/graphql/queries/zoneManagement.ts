import { gql } from '@apollo/client';

export const GET_ZONES_WITH_FILTER = gql` query GetZonesWithFilter($zoneData: GetZonesDto!) {
    getZonesWithFilter(zoneData: $zoneData) {
      message
      data {
        zones {
          uuid
          location
          city
          diversion_percentage
          parent {
            uuid
            location
            city
            diversion_percentage
            zoneCount
          }
        }
        count
      }
    }
  }`;