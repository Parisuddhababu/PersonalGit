This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
Node version: v18.16.0
NPM version: 9.6.7

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

#################### STEP FOR SETUP GRAPHQL IN NEXT APP #############################

> > Setting Up Apollo Client

    npm install @apollo/client graphql

> > Create a new file in pages/api called apollo-client.tsx

    import { ApolloClient, InMemoryCache } from "@apollo/client";

    const client = new ApolloClient({
        uri: "https://countries.trevorblades.com",
        cache: new InMemoryCache(),
    });

    export default client;

> > Inside of pages/index.js import the client we created in apollo-client.js and gql from @apollo/client

    import { gql } from "@apollo/client";
    import client from "../apollo-client";


    export async function getStaticProps() {
        const { data } = await client.query({
          query: gql`
    	query Countries {
    	  countries {
    	    code
    	    name
    	    emoji
    	  }
    	}
          `,
        });

        return {
          props: {
    	countries: data.countries.slice(0, 4),
          },
       };
    }

> > Using Apollo Client for server side rendered page data

    Duplicate ./pages/index.js and rename it to server-side.js. Then change the name of the function that fetches the data from getStaticProps to getServerSideProps.

    // pages/server-side.js
    export async function getServerSideProps() {
      const { data } = await client.query({
        query: gql`
          query Countries {
    	countries {
    	  code
    	  name
    	  emoji
    	}
          }
        `,
      });

      return {
        props: {
          countries: data.countries.slice(0, 4),
        },
      };
    }
