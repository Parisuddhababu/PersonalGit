import { gql } from '@apollo/client';

export const CREATE_EMPLOYEE_ACCOUNT = gql`
mutation EmployeeCreate($employeeData: CreateSubscriberEmployeeDto!) {
  employeeCreate(employeeData: $employeeData) {
    message
    data {
      email
      uuid
      status
      pronounce
      first_name
      last_name
      phone_number      
      preferred_language
      location
      department   
    }
  }
}

`