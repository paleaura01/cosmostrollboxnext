import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router'

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (isSignIn) {
        await Auth.signIn(username, password);
        router.push('/trollbox');
      } else {
        const signUpResult = await Auth.signUp({
          username,
          password,
          attributes: {
            email,
          },
        });
        if (!signUpResult.userConfirmed) setIsSignIn(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
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
            <input type="text"
placeholder="Confirmation Code"
value={confirmationCode}
onChange={handleConfirmationCodeChange}
/>
<br />
<button onClick={handleConfirmSignUp}>Confirm Sign Up</button>
</div>
)}
<button type="submit">{isSignIn ? 'Sign In' : 'Sign Up'}</button>
</form>
{isSignIn ? (
<div>
Don't have an account?{' '}
<button onClick={handleSignUp}>Sign Up!</button>
</div>
) : (
<div>
Already have an account?{' '}
<button onClick={() => setIsSignIn(true)}>Sign In!</button>
</div>
)}
</div>
);
};

export default SignIn;

