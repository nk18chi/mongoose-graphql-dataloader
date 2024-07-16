import { rule } from 'graphql-shield';

const isAuthenticated = rule({ cache: 'contextual' })(async (_, __, context) => !!context.user);

export default isAuthenticated;
