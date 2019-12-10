import AppConfig from './AppConfig';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import gql from 'graphql-tag';

const cache = new InMemoryCache();
const httpLink = new HttpLink({
  uri: AppConfig.GRAPHQL_SERVER,
});
const authLink = setContext((_, { headers }) => {
  let token = localStorage.token;
  return {
    headers: {
      ...headers,
      "x-access-token": token
    }
  }
});
const client = new ApolloClient({
  cache: cache,
  link: authLink.concat(httpLink),
  name: 'react-web-client',
  version: '1.3',
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export class ApiClient
{
  QueryAsync(query,variables){
    return client.query({query:gql(query),variables:variables});
  }
  MutateAsync(query,variables){
    return client.mutate({mutation :gql(query),variables:variables});
  }
}
