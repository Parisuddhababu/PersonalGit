import { gql } from '@apollo/client';

export const UPDATE_SUBSCRIBER_EMPLOYEE_USER = gql`
mutation UpdateSubscriberEmployeeUser($subscriberUserData: UpdateSubscriberEmployeeDto!, $subscriberUserId: String!) {
  updateSubscriberEmployeeUser(subscriberUserData: $subscriberUserData, subscriberUserId: $subscriberUserId) {
    message
  }
}
`