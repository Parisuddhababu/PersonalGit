import { gql } from "@apollo/client";

export const UPDATE_ROLE_DATA = gql`
  mutation UpdateRole($updateRoleId: ID, $roleName: String, $key: String) {
    updateRole(id: $updateRoleId, role_name: $roleName, key: $key) {
      data {
        uuid
        role_name
        key
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
          error
          errorField
        }
        errorType
      }
    }
  }
`;

export const CREATE_ROLE_DATA = gql`
  mutation createRole($roleName: String, $key: String) {
    createRole(role_name: $roleName, key: $key) {
      data {
        uuid
        role_name
        key
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

export const UPDATE_ROLE_STATUS = gql`
  mutation UpdateStatusRole($updateStatusRoleId: ID, $status: Int) {
    updateStatusRole(id: $updateStatusRoleId, status: $status) {
      data {
        uuid
        role_name
        key
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
          error
          errorField
        }
        errorType
      }
    }
  }
`;
