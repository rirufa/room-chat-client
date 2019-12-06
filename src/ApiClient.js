import AppConfig from './AppConfig';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const client = new ApolloClient({
  uri: AppConfig.GRAPHQL_SERVER,
  request: operation => {
    let token = localStorage.token;
    operation.setContext({
      headers: {
        "x-access-token": token
      }
    });
  }
});

export class ApiClient
{
  QueryAsync(query,variables){
    return client.query({query:gql(query),variables:variables});
  }
}
