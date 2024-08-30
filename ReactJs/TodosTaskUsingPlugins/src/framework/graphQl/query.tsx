import { gql } from "@apollo/client";
export const Get_Todos = gql`
  query TodosPage {
    todos {
      data {
        title
        id
        user {
          email
          name
          phone
          username
          website
        }
      }
    }
  }
`;
