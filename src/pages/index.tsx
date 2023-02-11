import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import SignIn from '../components/signin';
import Trollbox from './trollbox';
import { withRouter } from 'next/router';

const Home = ({ router }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await Auth.currentAuthenticatedUser();
        setIsSignedIn(true);
      } catch (error) {
        console.error(error);
      }
    };

    checkUser();
  }, []);

  return (
    <div>
      {isSignedIn ? (
        <Trollbox />
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default withRouter(Home);