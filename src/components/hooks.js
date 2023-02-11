import React, { useState } from 'react';
import { Auth } from "aws-amplify";

export const useUser = () => {
    const [username, setUsername] = useState('');
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    return [username, handleUsernameChange];
};

export const usePass = () => {
    const [password, setPassword] = useState('');
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    return [password, handlePasswordChange];
};

export const useEmail = () => {
    const [email, setEmail] = useState('');
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    return [email, handleEmailChange];
};

export const useConf = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const handleConfirmationCodeChange = (event) => {
        setConfirmationCode(event.target.value);
    };
    return [confirmationCode, handleConfirmationCodeChange];
};

export const hanSub = async (username, password, email, isSignIn, setIsLoading, setIsSignIn) => {
  console.log('username:', username);
  console.log('password:', password);
  console.log('email:', email);
  console.log('isSignIn:', isSignIn);
  console.log('setIsLoading:', setIsLoading);
  console.log('setIsSignIn:', setIsSignIn);

  setIsLoading(true);
  try {
    if (isSignIn) {
      await Auth.signIn(username, password);
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

export const hanConfSu = async (username, confirmationCode, setIsSignIn) => {
  console.log('username:', username);
  console.log('confirmationCode:', confirmationCode);
  console.log('setIsSignIn:', setIsSignIn);

  try {
    await Auth.confirmSignUp(username, confirmationCode);
    setIsSignIn(true);
  } catch (error) {
    console.error(error);
  }
};

export const hanSu = (setIsSignIn) => {
  console.log('setIsSignIn:', setIsSignIn);

  setIsSignIn(false);
};