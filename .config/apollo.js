import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
//Automatizar el token
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/',
    fetch,
});

const authLink = setContext((_, { headers }) => {
    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});
const client = new ApolloClient({
    connectToDevTools: true,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
