import { graphql } from '@/gql/types';
import { query } from '@/lib/ApolloClient';

const GET_USER_TOKEN = graphql(`
  query userToken {
    userToken
  }
`);

export default async function ServerComponent() {
  const { data } = await query({ query: GET_USER_TOKEN });
  return <p>Server Component Token: {data.userToken}</p>;
}
