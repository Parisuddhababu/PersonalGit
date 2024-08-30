import { gql } from '@apollo/client';

export const GET_ZONE_BY_SITE_ID = gql`mutation GetZoneBySiteId($siteId: String!) {
    getZoneBySiteId(siteId: $siteId) {
      message
      data {
        uuid
        location
        city
        diversion_percentage
        zoneCount
      }
    }
  }`;



export const CREATE_OR_UPDATE_ZONE = gql`mutation CreateOrUpdateZone($zoneData: CreateZoneDto!) {
  createOrUpdateZone(zoneData: $zoneData) {
    message
    data {
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
  }
}`;

export const DELETE_ZONE = gql`mutation DeleteZone($siteId: String!, $zoneId: String!) {
  deleteZone(siteId: $siteId, zoneId: $zoneId) {
    message
  }
}`;

export const GET_ACTIVE_SITES = gql`query GetActiveSites {
  getActiveSites {
    message
    data {
      uuid
      location
      city
      diversion_percentage
      zoneCount
    }
  }
}`;

export const GET_ZONES_BY_ID =gql`mutation GetZoneBySiteId($siteId: String!) {
  getZoneBySiteId(siteId: $siteId) {
    message
    data {
      uuid
      location
      city
      diversion_percentage
      zoneCount
    }
  }
} `