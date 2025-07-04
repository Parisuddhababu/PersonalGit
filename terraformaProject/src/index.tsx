import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import App from './App';
import './i18n';
import client from '@framework/graphql';
import reportWebVitals from './reportWebVitals';

import { ApolloProvider } from '@apollo/client';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	// <React.StrictMode>
		<Provider store={store}>
			<ApolloProvider client={client}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</ApolloProvider>
		</Provider>
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
