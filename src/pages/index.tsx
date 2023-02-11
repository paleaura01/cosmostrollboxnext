import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import SignIn from "../components/signin";
import TrollBox from "../components/trollbox";

const Home = () => {
const [isSignedIn, setIsSignedIn] = useState(false);

useEffect(() => {
const checkUser = async () => {
try {
const session = await Auth.currentSession();
setIsSignedIn(!!session);
} catch (error) {
console.error(error);
}
};

checkUser();
}, []); // Only run the effect on mount

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

export default Home;