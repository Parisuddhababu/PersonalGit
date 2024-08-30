import { gql } from "@apollo/client";
import { META_FRAGMENT } from "../fragments";

export const GET_SCHEDULE_STREAMING = gql`
  ${META_FRAGMENT}
  query FetchScheduleStreaming($page: Int, $limit: Int, $sortBy: String, $sortOrder: String) {
    fetchScheduleStreaming(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        scheduleData {
          uuid
          schedule_date
          schedule_time
          HostDetails {
            first_name
            last_name
            email
            status
          }
          BrandDomainDetails {
            uuid
            domain_name
            status
          }
          timeZone
          stream_title
          stream_description
          end_date
          status
          product_id
          invitation_url
          invited_user_email
        }
        count
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;

export const GET_SINGLE_SCHEDULE_STREAMING = gql`
  ${META_FRAGMENT}
  query GetScheduleStreaming($scheduleUuid: String) {
    getScheduleStreaming(schedule_uuid: $scheduleUuid) {
      data {
        uuid
        schedule_date
        schedule_time
        HostDetails {
          first_name
          last_name
          email
          status
        }
        BrandDomainDetails {
          uuid
          domain_name
          status
        }
        timeZone
        stream_title
        stream_description
        end_date
        status
        invite {
          uuid
          product_id
          invitation_url
          invited_user_email
          product {
            name
          }
        }
        product {
          name
        }
      }
      meta {
        ...MetaFragment
      }
    }
  }
`;
