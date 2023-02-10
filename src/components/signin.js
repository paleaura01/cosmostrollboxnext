import React, { useState } from "react";
import { Auth } from "aws-amplify";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleConfirmationCodeChange = (event) => {
    setConfirmationCode(event.target.value);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSignIn) {
      try {
        await Auth.signIn(username, password);
        if (rememberMe) {
          await Auth.signIn(username, password, true);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const signUpResult = await Auth.signUp({
          username,
          password,
          attributes: {
            email,
          },
        });
        if (signUpResult.userConfirmed) {
          console.log("User is confirmed");
        } else {
          console.log("User is not confirmed");
          setIsSignIn(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      console.log("User confirmed");
      setIsSignIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUp = () => {
    setIsSignIn(false);
  };

  return (
    <div>
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
