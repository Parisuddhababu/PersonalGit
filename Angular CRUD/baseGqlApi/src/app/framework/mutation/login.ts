import { gql } from "apollo-angular";

export const Login=gql`
mutation Mutation($email: String, $password: String) {
  loginUser(email: $email, password: $password) {
    data {
      user {
        id
        uuid
        first_name
        middle_name
        last_name
        user_name
        email
        gender
        date_of_birth
        phone_no
        phone_country_id
        role
        user_type
        profile_img
        device_type
        device_token
        status
        created_at
        updated_at
        serialNo
      }
      token
      refreshToken
      permissions
      expiresIn
      expiresAt
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

export const RefreshToken=gql`
mutation GenerateRefreshToken($refreshToken: String) {
  generateRefreshToken(refreshToken: $refreshToken) {
    data {
      token
      expiresIn
      expiresAt
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