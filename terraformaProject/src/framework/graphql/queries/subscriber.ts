import { gql } from '@apollo/client';


export const GET_SUBSCRIBER_BY_ID = gql `
query GetSubscriber($subscribersId: String!) {
  getSubscriber(subscribersId: $subscribersId) {
    message
    data {
      uuid
      first_name
      last_name
      company_name
      address
      phone_number
      email
      subscriber_id
      country_code {
        id
        uuid
        name
        countryCode
        phoneCode
      }
      logo
      thumbnail
      subscribe_start
      subscribe_end
      status
      subscriber_branch {
        uuid
        location
        city
      }
      
    }
  }
}



`
export const FETCH_SUBSCRIBER_DETAIL_PAGINATION = gql `
query GetSubscribers($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
  getSubscribers(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
    message
    data {
      Subscriber {
        uuid
        first_name
        last_name
        company_name
        address
        phone_number
        country_code {
          uuid
          name
          phoneCode
        }
        logo
        subscribe_start
        subscribe_end
        email
        status
      }
      count
    }
  }
}
`

export const GET_COUNTRY = gql `
query GetCountries {
  getCountries {
    data {
      countryCode
      name
      phoneCode
      uuid
    }
    message
  }
}
`
