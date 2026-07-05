'use client';

import { Amplify } from 'aws-amplify';

const USER_POOL_ID = process.env['NEXT_PUBLIC_COGNITO_USER_POOL_ID'] ?? 'us-east-1_jw3PdJZAN';
const CLIENT_ID = process.env['NEXT_PUBLIC_COGNITO_CLIENT_ID'] ?? '780qhrdegeu08g7nlb81bqpuvv';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: USER_POOL_ID,
      userPoolClientId: CLIENT_ID,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
});

export default function configureAmplify() {
  // This function is a no-op. Importing this module is enough to configure Amplify.
  // It exists to make the side-effect explicit.
}
