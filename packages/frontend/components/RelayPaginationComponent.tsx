'use client';

import { UserConnection } from '@/gql/types';
import { gql, useQuery } from '@apollo/client';

const GET_USERS = gql`
  query Users($first: Int!, $after: String) {
    users(first: $first, after: $after) {
      edges {
        cursor
        node {
          _id
          name
          followers {
            _id
            name
          }
          following {
            _id
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
const pagination = 10;

export default function RelayPaginationComponent() {
  const { loading, data, fetchMore } = useQuery<{ users: UserConnection }>(GET_USERS, {
    variables: { first: pagination },
  });
  if (loading) return <p>Loading...</p>;
  return (
    <>
      <p>Users</p>
      <ul>{data?.users.edges?.map((edge) => <li key={edge?.cursor}>{edge?.node?.name}</li>)}</ul>
      {data?.users.pageInfo?.hasNextPage && (
        <button
          onClick={() => {
            fetchMore({
              variables: { first: pagination, after: data?.users?.pageInfo?.endCursor },
            });
          }}
        >
          Show More
        </button>
      )}
    </>
  );
}
