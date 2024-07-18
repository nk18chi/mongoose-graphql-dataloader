import { query } from '@/lib/ApolloClient';
import { gql } from '@apollo/client';

const GET_USER_TOKEN = gql`
  query userToken {
    userToken
  }
`;

export default async function ServerComponent() {
  const { data } = await query({ query: GET_USER_TOKEN });
  return <p>Server Component Token: {data.userToken}</p>;
}
