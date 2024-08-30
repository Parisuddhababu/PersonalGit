export const GET_ALL_POST = `
query getAllPost ($options: PageQueryOptions) {
    posts(options: $options) {
      data {
        id
        title
      }
      meta {
        totalCount
      }
    }
  }
`

export const GET_POST_DETAILS =  `
query getPostDetails($id: ID!){
  post(id:$id){
    id
    title
    body
    user{
      id
      name
      username
    }
  }
}

`