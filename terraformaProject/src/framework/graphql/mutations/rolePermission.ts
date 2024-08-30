import { gql } from '@apollo/client';

export const CREATE_ROLE_PERMISSIONS = gql`
  mutation UpdateRolePermissionsMapping($rolePermissionData: InputPermissionMultiDto!) {
    updateRolePermissionsMapping(rolePermissionData: $rolePermissionData) {
      message
    }
  }
`;
