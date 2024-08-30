import { gql } from "@apollo/client";

export const FETCH_PERMISSIONS = gql`
  query GetPermissions {
    getPermissions {
      data {
        permissondata {
          id
          uuid
          module_id
          permission_name
          key
          status
          created_by
          createdAt
          updatedAt
        }
        count
      }
      meta {
        message
        messageCode
        statusCode
        status
      }
    }
  }
`;
export const FETCH_ROLE_PERMISSIONS_BY_ID = gql`
  query FetchRolePermissions($roleId: Int) {
    fetchRolePermissions(roleId: $roleId) {
      data {
        permissionList {
          id
          uuid
          module_id
          permission_name
          key
          status
          created_by
          createdAt
          updatedAt
        }
        count
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
