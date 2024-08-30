
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import DecryptionFunction from 'src/services/decryption';
import { destroyAuth } from 'src/utils/helpers';

const httpLink = new HttpLink({
	uri: process.env.REACT_APP_API_GATEWAY_URL,
});

const authMiddleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	const encryptedToken = localStorage.getItem('authToken') as string;
	const token = encryptedToken && DecryptionFunction(encryptedToken);
	operation.setContext(({ headers = {} }) => ({
	  headers: {
		...headers,
		authorization: token ? `Bearer ${token}` : '',
	  }
	}));
  
	return forward(operation);
  })

const errorLink = onError(
	({ graphQLErrors }) => {
	  if (graphQLErrors) {
		for (const err of graphQLErrors) {	
			if(err.extensions.code === 401) {
				destroyAuth();		
				window.location.replace(window.location.origin);
			}
		}
	  }
	}
  );
const client = new ApolloClient({
	link: from([authMiddleware, errorLink, httpLink]),
	cache: new InMemoryCache(),
});

export default client;
