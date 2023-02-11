import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Auth } from "aws-amplify";
import SignIn from "src/components/signin.js";
import TrollBox from "src/components/trollbox.js";

const Home = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Auth.currentSession().then((session) => {
      if (session) {
        setIsSignedIn(true);
      }
    });
  }, []);

  return (
    <div>
      {isSignedIn ? (
        <TrollBox />
      ) : (
        <SignIn setIsSignedIn={setIsSignedIn} />
      )}
    </div>
  );
};

export default Home;
