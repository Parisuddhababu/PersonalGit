import { gql } from '@apollo/client';

export const CHANGE_SUBADMIN_STATUS = gql`
mutation ChangeSubAdminStatus($changeSubAdminStatusId: Int, $status: Int) {
    changeSubAdminStatus(id: $changeSubAdminStatusId, status: $status) {
      data {
        id
        first_name
        last_name
        user_name
        email
        password
        role
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

export const DELETE_SUBADMIN = gql`
mutation DeleteSubAdmin($deleteSubAdminId: Int) {
    deleteSubAdmin(id: $deleteSubAdminId) {
      data {
        id
        first_name
        last_name
        user_name
        email
        password
        role
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


export const CHANGE_SUBADMIN_PASSWORD = gql`
mutation ChangeSubAdminPassword($changeSubAdminPasswordId: Int, $oldPassword: String, $newPassword: String) {
  changeSubAdminPassword(id: $changeSubAdminPasswordId, oldPassword: $oldPassword, newPassword: $newPassword) {
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
`

export const CREATE_SUBADMIN = gql`
mutation CreateSubAdmin($userName: String, $firstName: String, $lastName: String, $email: String, $password: String, $confirmPassword: String, $role: Int) {
  createSubAdmin(user_name: $userName, first_name: $firstName, last_name: $lastName, email: $email, password: $password, confirm_password: $confirmPassword, role: $role) {
    data {
      id
      first_name
      last_name
      user_name
      email
      password
      role
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

export const UPDATE_SUBADMIN = gql`
mutation UpdateSubAdmin($updateSubAdminId: Int, $firstName: String, $lastName: String, $email: String, $role: Int) {
  updateSubAdmin(id: $updateSubAdminId, first_name: $firstName, last_name: $lastName, email: $email, role: $role) {
    data {
      id
      first_name
      last_name
      user_name
      email
      password
      role
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
export const GROUP_DELETE_SUBADMIN = gql`mutation GroupDeleteSubAdmins($groupDeleteSubAdminsId: [Int]) {
  groupDeleteSubAdmins(id: $groupDeleteSubAdminsId) {
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