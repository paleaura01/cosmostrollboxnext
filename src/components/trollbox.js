import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Trollbox from "./Trollbox";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // ... other code

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSignIn) {
      try {
        await Auth.signIn(username, password);
        if (rememberMe) {
          await Auth.signIn(username, password, true);
        }
        setIsSignedIn(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      // ... other code
    }
  };

  // ... other code

  return (
    <div>
      {isSignedIn ? (
        <Trollbox />
      ) : (
        <form onSubmit={handleSubmit}>
          {!isSignIn && (
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
              <br />
            </div>
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <br />
          {!isSignIn && (
            <div>
              <input
                type="text"
                placeholder="Confirmation Code"
                value={confirmationCode}
                onChange={handleConfirmationCodeChange}
              />
              <br />
              <button onClick={handleConfirmSignUp}>Confirm Sign Up</button>
            </div>
          )}
          {isSignIn && (
            <div>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              Remember me
              <br />
            </div>
          )}
          <button type="submit">{isSignIn ? "Sign In" : "Sign Up"}</button>
        </form>
      )}
      {isSignIn ? (
        <div>
          Don't have an account?{" "}
          <button onClick={handleSignUp}>Sign Up!</button>
        </div>
      ) : (
        <div>
          Already have an account?{" "}
          <button onClick={() => setIsSignIn(true)}>Sign In!</button>
        </div>
      )}
    </div>
  );
};

export default SignIn;