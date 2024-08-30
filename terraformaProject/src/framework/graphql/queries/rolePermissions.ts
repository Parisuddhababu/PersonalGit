import { gql } from '@apollo/client';

export const GET_PERMISSIONS = gql`
  query GetRolePermissions {
    getRolePermissions {
      data {
        is_read
        is_remove
        is_update
        is_write
        module_id {
          description
          name
          parent {
            description
            name
            uuid
          }
          uuid
        }
        role_id {
          description
          name
          status
          uuid
        }
        uuid
      }
      message
    }
  }
`;
export const FETCH_ROLE_PERMISSIONS_BY_ID = gql`
  query GetRolePermissionById($roleId: String!) {
    getRolePermissionsByRoleId(roleId: $roleId) {
      data {
        children {
          is_read
          is_remove
          is_update
          is_write
          module_id {
            description
            name
            parent {
              uuid
              name
              description
            }
            uuid
          }
          role_id {
            description
            name
            status
            uuid
          }
          uuid
        }
        is_read
        is_remove
        is_update
        is_write
        uuid
        role_id {
          uuid
          status
          name
          description
        }
        module_id {
          uuid
          parent {
            name
            description
            uuid
          }
          name
          description
        }
      }
      message
    }
  }
`;
