declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      NODE_ENV: 'development' | 'production' | 'test';
      GRAPHQL_QUERY_MAX_COMPLEXITY: number;
      LOCALHOST_PORT: number;
    }
  }
}

export {};
