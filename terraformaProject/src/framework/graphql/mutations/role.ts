import { gql } from '@apollo/client'

export const UPDATE_ROLE = gql`
mutation UpdateRole($roleData: CreateRoleDto!, $roleId: String!) {
  updateRole(roleData: $roleData, roleId: $roleId) {
    data {
      name
      status
      uuid
      description
    }
    message
  }
}
`


export const CREATE_ROLE = gql`
mutation CreateRole($roleData: CreateRoleDto!) {
    createRole(roleData: $roleData) {
      message
      data {
        description
        status
        name
        uuid
      }
    }
  }
`

export const UPDATE_ROLE_STATUS = gql`
mutation ActivateRole($roleId: String!) {
  activateRole(roleId: $roleId) {
    data {
      description
      name
      status
      uuid
    }
    message
  }
}
`

export const DELETE_ROLE = gql`
mutation DeleteRole($roleId: String!) {
  deleteRole(roleId: $roleId) {
    data {
      description
      name
      status
      uuid
    }
    message
  }
}
`


export const DELETE_GROUP_ROLE=gql`
mutation GroupDeleteRoles($groupDeleteRolesId: [Int]) {
  groupDeleteRoles(id: $groupDeleteRolesId) {
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
}`








