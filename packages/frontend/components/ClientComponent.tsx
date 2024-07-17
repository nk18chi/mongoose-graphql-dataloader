'use client';

import { gql, useSuspenseQuery } from '@apollo/client';

const GET_USER_TOKEN = gql`
  query userToken {
    userToken
  }
`;
export default function ClientComponent() {
  const { data } = useSuspenseQuery<{ userToken: string }>(GET_USER_TOKEN);

  return <p>Client ComponentToken: {data.userToken}</p>;
}
