import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import SignIn from './SignIn';
import TrollBox from './TrollBox';
import { withRouter } from 'next/router';

const Home = ({ router }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const session = await Auth.currentSession();
      setIsSignedIn(!!session);
    };

    checkUser();
  }, []);

  return (
    <div>
      {isSignedIn ? (
        <TrollBox />
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default withRouter(Home);