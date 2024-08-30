import { gql } from "@apollo/client";

export const Create_Todo = gql(`
  mutation data($title: String!, $completed: Boolean!) {
    createTodo(input:{ title: $title,completed: $completed }) {
      title

    }
  }
`);





