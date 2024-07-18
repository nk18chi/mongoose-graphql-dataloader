'use client';

import { gql, useQuery } from '@apollo/client';

const GET_USER_TOKEN = gql`
  query userToken {
    userToken
  }
`;

export default function ClientComponent() {
  // const { data } = useSuspenseQuery<{ userToken: string }>(GET_USER_TOKEN); // server side https://github.com/apollographql/apollo-client/issues/11724
  const { data } = useQuery<{ userToken: string }>(GET_USER_TOKEN);
  return <p>Client ComponentToken: {data?.userToken}</p>;
}
