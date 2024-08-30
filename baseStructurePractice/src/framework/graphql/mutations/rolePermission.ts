import { gql } from "@apollo/client";

export const CREARTE_ROLE_PERMISSIONS = gql`
  mutation CreateAndRolePermissions($roleId: Int, $permissionIds: [Int]) {
    CreateAndRolePermissions(roleId: $roleId, permissionIds: $permissionIds) {
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
