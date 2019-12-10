import AppConfig from './AppConfig';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import gql from 'graphql-tag';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const cache = new InMemoryCache();
const httpLink = new HttpLink({
  uri: AppConfig.GRAPHQL_SERVER,
});
const wsLink = new WebSocketLink({
  uri: AppConfig.GRAPHQL_WSSERVER,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => ({
      "x-access-token": localStorage.token,
    }),
  }
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
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);
const client = new ApolloClient({
  cache: cache,
  link: link,
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
  SubscribeAsync(query,variables){
    return client.subscribe({query :gql(query),variables:variables});
  }
}
