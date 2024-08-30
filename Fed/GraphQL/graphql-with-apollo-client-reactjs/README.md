# **[GraphQL with Apollo Client](#)**

GraphQL with Apollo Client is a powerful combination used in web development to manage and consume data from a GraphQL API.

### Purposes and Benefits of using GraphQL with Apollo Client

- Efficient Data Fetching
  - Query Optimization
- Single Source of Truth
  - Centralized State Management
- Declarative Data Fetching

  - Declarative Syntax

- Real-time Data Updates

  - Subscriptions

- Server-Side Rendering (SSR) and Static Site Generation (SSG)

  - Next.js Integration

- Mutations and Local State Management

  - Mutations
  - Local State

- Caching and Normalization

  - Automatic Caching

- Error Handling

  - Error Propagation

- Extensibility and Middleware
  - Apollo Middleware Support

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js and npm (Node Package Manager)

  - Node version: v16.16.0
  - NPM version: 9.6.7

## Usage

- ### Install dependencies
  npm install @apollo/client graphql
- ### Initialize ApolloClient in pages/api/apollo-client.tsx

  - #### Create a one apollo-client.tsx file for initialize ApolloClient
    ```
    import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, } from "@apollo/client";
        const client = new ApolloClient({
            uri: "GRAPHQL_BASE_URL",
            cache: new InMemoryCache(),
        });
    export default client;
    ```

- ### Create a GraphQL query in pages/api/query/Post/Post.tsx

  ```
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
  ```

- ### Create a operation file in pages/api/operations/post/getAllPost.tsx

  ```
  import { gql } from "@apollo/client";
  import client from "../../apollo-client";
  import { GET_ALL_POST } from "../../query/post/Post";
  const getAllPost= async (page:number,limit:number)=>{
  const data  = await client.query({
      query: gql`${GET_ALL_POST}`,
      variables:{
          "options": {
              "paginate":
              {
                  "page": page,
                  "limit": limit
              }
          }
      }
      });
      return {
      props: data
      };
  }

  export default getAllPost;
  ```

- ### Call the graphql operation and set the static props and pass the static props in component

  - ### Create a new file pages/post/index.tsx

    ```
    import Post from "../../components/Post";
    import getAllPost from "../api/oprations/post/getAllPost";

    export async function getStaticProps(activeStep:any) {
    const posts = await getAllPost(1,10);
    return {
        props: {
        posts
        },
    }
    }
    function PostList(props:any){
        return(
            <>
            <Post {...props} />
            </>
        );
    }

    export default PostList;
    ```

- ### And finally set the props value in component

### Snapshot

![Graphql With Apollo Client](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/GraphQL/graphql-with-apollo-client-reactjs/Application%20Snapshot/graphql-with-apollo-client-reactjs.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)
