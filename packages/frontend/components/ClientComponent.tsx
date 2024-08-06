'use client';

import { graphql } from '@/gql/types';
import { useSuspenseQuery } from '@apollo/client';

const GET_USER_TOKEN = graphql(`
  query userToken {
    userToken
  }
`);

export default function ClientComponent() {
  const { data } = useSuspenseQuery(GET_USER_TOKEN); // server side https://github.com/apollographql/apollo-client/issues/11724
  return <p>Client ComponentToken: {data.userToken}</p>;
}
