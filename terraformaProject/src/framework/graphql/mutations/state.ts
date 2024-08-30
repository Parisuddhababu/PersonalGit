import { gql } from '@apollo/client';
export const CREATE_STATE = gql`
  mutation CreateState(
    $name: String
    $stateCode: String
    $status: Int
    $countryId: Int
  ) {
    createState(
      name: $name
      state_code: $stateCode
      status: $status
      country_id: $countryId
    ) {
      data {
        id
        uuid
        name
        country_id
        state_code
        status
        created_at
        updated_at
              
      }
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
    }
  }
`;

export const CHANGE_STATE_STATUS = gql`
  mutation ChangeStateStatus($changeStateStatusId: Int, $status: Int) {
    changeStateStatus(id: $changeStateStatusId, status: $status) {
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
    }
  }
`;

export const DELETE_STATE = gql`
  mutation DeleteState($deleteStateId: Int) {
    deleteState(id: $deleteStateId) {
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
      data {
        id
        uuid
        name
        state_code
        status
        created_at
        updated_at
      }
    }
  }
`;

export const UPDATE_STATE = gql`
  mutation UpdateState(
    $updateStateId: Int
    $name: String
    $stateCode: String
    $status: Int
    $countryId: Int
  ) {
    updateState(
      id: $updateStateId
      name: $name
      state_code: $stateCode
      status: $status
      country_id: $countryId
    ) {
      data {
        id
        uuid
        name
        state_code
        status
        created_at
        updated_at
      }
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
    }
  }
`
export const GROUP_DELETE_STATE = gql`mutation GroupDeleteStates($groupDeleteStatesId: [Int]) {
  groupDeleteStates(id: $groupDeleteStatesId) {
    meta {
      message
      messageCode
      statusCode
      status
      type
      errors {
        errorField
        error
      }
      errorType
    }
  }
}`;
