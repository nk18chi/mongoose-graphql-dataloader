'use client';

import { HttpLink } from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import sha256 from '../lib/sha256';

const linkChain = createPersistedQueryLink({ sha256, useGETForHashedQueries: true }).concat(
  new HttpLink({ uri: process.env.NEXT_PUBLIC_API_URL }),
);

function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: linkChain,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
