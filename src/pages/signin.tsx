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

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleConfirmationCodeChange = (e) => setConfirmationCode(e.target.value);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      isSignIn
        ? await Auth.signIn(username, password) && router.push('/trollbox')
        : !(await Auth.signUp({username, password, attributes: { email }})
            .userConfirmed) && setIsSignIn(false);
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
  const handleSignUp = () => setIsSignIn(false);

  return (
    <form onSubmit={handleSubmit}>
      {!isSignIn && (
        <>
          <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
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
          <button onClick={handleConfirmSignUp}>Confirm Sign Up</button>
        </div>
      )}
      <button type="submit">{isSignIn ? 'Sign In' : 'Sign Up'}</button>
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
      </form>
    );
  };
  export default SignIn;