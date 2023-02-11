import React, { useState } from "react";
import { useUser, usePass, useEmail, useConf, hanSub, hanConfSu, hanSu } from "./hooks";
import { Router, Link } from "src/pages/routes.js";
import { Auth } from "aws-amplify";

const SignIn = () => {
  const [username, handleUsernameChange] = useUser();
  const [password, handlePasswordChange] = usePass();
  const [email, handleEmailChange] = useEmail();
  const [confirmationCode, handleConfirmationCodeChange] = useConf();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {!isSignIn && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <br />
        </>
      )}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
        autoComplete="username"
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        autoComplete="current-password"
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
          <button onClick={() => hanConfSu(username, confirmationCode, setIsSignIn)}>Confirm Sign Up</button>
        </div>
      )}
      <button type="submit" onClick={() => hanSub(username, password, email, isSignIn, setIsLoading, setIsSignIn)}>
        {isSignIn ? 'Sign In' : 'Sign Up'}
      </button>
    </div>
  );
};
export default SignIn