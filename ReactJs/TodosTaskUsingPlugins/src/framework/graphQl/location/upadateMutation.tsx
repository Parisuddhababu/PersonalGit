import { gql } from "@apollo/client";


export const Update_Todo = gql(`
mutation UpdateTodo($updateTodoId: ID!, $input: UpdateTodoInput!) {
  updateTodo(id: $updateTodoId, input: $input) {
    id
    title
  }
}
`);
