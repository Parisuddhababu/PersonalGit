import { gql } from '@apollo/client';
export const CREATE_SUBSCRIBER = gql`
mutation CreateSubscriber($subscriberData: CreateSubscriberDto!) {
  createSubscriber(subscriberData: $subscriberData) {
    message
    data {
      uuid
      first_name
      last_name
      company_name
      address
      phone_number
      country_code {
        name
        phoneCode
      }
      logo
      subscribe_start
      subscribe_end
      status
    }
  }
}
`;

export const BLOCK_SUBSCRIBER = gql`
mutation BlockSubscriber($status: Float!, $subscribersId: String!) {
  blockSubscriber(status: $status, subscribersId: $subscribersId) {
    message
    data {
      uuid
      first_name
      last_name
      company_name
      address
      phone_number
      logo
      subscribe_start
      subscribe_end
      status
    }
  }
}
`;

export const DELETE_SUBSCRIBER = gql`
mutation DeleteSubscriber($subscribersId: String!) {
  deleteSubscriber(subscribersId: $subscribersId) {
    message
  }
}
`;

export const UPDATE_SUBSCRIBER = gql`
mutation UpdateSubscriber($subscriberData: UpdateSubscriberDto!, $subscriberId: String!) {
  updateSubscriber(subscriberData: $subscriberData, subscriberId: $subscriberId) {
    message
    data {
      uuid
      first_name
      last_name
      company_name
      address
      phone_number
      country_code {
        id
        uuid
        name
        countryCode
        phoneCode
      }
      logo
      subscribe_start
      subscribe_end
      status
      subscriber_branch {
        uuid
        location
      }
    }
  }
}
`
