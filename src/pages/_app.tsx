import React from 'react';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
};

export default App;