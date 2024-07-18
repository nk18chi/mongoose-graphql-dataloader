import { HttpLink } from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { registerApolloClient, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import sha256 from './sha256';

export const linkChain = createPersistedQueryLink({ sha256, useGETForHashedQueries: true }).concat(
  new HttpLink({ uri: process.env.NEXT_PUBLIC_API_URL }),
);

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: linkChain,
  });
});
