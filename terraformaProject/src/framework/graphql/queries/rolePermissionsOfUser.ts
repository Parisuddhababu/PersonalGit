import { gql } from '@apollo/client';

export const GET_ROLE_PERMISSIONS_OF_USER = gql`
  query GetRolePermissionsOfUser {
    getRolePermissionsOfUser {
      message
      data {
        children {        
          is_read
          is_write
          is_update
          is_remove
          module_id {
            name          
          }       
        }
        is_read
        is_remove
        is_update
        is_write
        module_id {        
          parent {
            name          
          }
          name        
        }     
        uuid
      }
    }
  }
`