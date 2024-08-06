import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    './gql/types/': {
      preset: 'client',
    },
  },
};

export default config;
