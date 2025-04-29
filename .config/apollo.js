import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
//Automatizar el token
const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_BACKEND_URL,
    fetch,
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
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
