export const CREATE_POST = `
mutation CREATE_POST(
    $input: CreatePostInput!
  ) {
    createPost(input: $input) {
      id
      title
      body
    }
  }
`