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
    console.log(`[handleSubmit] Submitting form with ${isSignIn ? 'Sign In' : 'Sign Up'}`);
    try {
      if (isSignIn) {
        console.log(`[handleSubmit] Attempting to sign in with username: ${username}`);
        const signInResult = await Auth.signIn(username, password);
        console.log(`[handleSubmit] Successfully signed in!`);
        setIsLoading(false);
        router.push("/trollbox");
      } else {
        console.log(`[handleSubmit] Attempting to sign up with email: ${email}, username: ${username}`);
        const signUpResponse = await Auth.signUp({username, password, attributes: { email }});
        if (!signUpResponse.userConfirmed) {
          console.log(`[handleSubmit] User not confirmed, setting isSignIn to false`);
          setIsSignIn(false);
        }
      }
    } catch (error) {
      console.error(`[handleSubmit] Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async () => {
    console.log(`[handleConfirmSignUp] Attempting to confirm sign up with username: ${username} and confirmation code: ${confirmationCode}`);
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      console.log(`[handleConfirmSignUp] Successfully confirmed sign up!`);
      setIsSignIn(true);
    } catch (error) {
      console.error(`[handleConfirmSignUp] Error: ${error}`);
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
    Don&apos;t have an account?{' '}
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
