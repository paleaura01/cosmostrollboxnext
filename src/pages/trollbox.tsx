import React, { useState, useEffect } from "react";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { useRouter } from 'next/router'

const TrollBox = () => {
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const router = useRouter();
  const [newMessages, setNewMessages] = useState([]);

  useEffect(() => {
    console.log("[TrollBox] Setting up component");
    const userPool = new CognitoUserPool({
      UserPoolId: "us-east-1_Rb5Wn84th",
      ClientId: "9h486bll3noi9dh3h0eqf0601",
    });
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      console.log("[TrollBox] User is signed in, getting session");
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.error(`[TrollBox] Error getting session: ${err}`);
        } else {
          console.log(`[TrollBox] Session retrieved, setting username: ${session.getIdToken().payload.username}`);
          setUsername(session.getIdToken().payload.username);
        }
      });
    }

    console.log("[TrollBox] Fetching initial messages");
    const getMessages = `query {
      listMessages {
        items {
          id
          username
          text
        }
      }
    }`;
    setIsLoading(true);
    API.graphql(graphqlOperation(getMessages)).then((data) => {
      console.log("[TrollBox] Initial messages fetched");
      setMessages(data.data.listMessages.items);
      setIsLoading(false);

      console.log("[TrollBox] Setting up new message subscription");
      const newMessageSubscription = `subscription {
        onCreateMessage {
          id
          username
          text
        }
      }`;
      const newSubscription = API.graphql(graphqlOperation(newMessageSubscription)).subscribe({
        next: (eventData) => {
          console.log(`[TrollBox] New message received: ${JSON.stringify(eventData.value.data.onCreateMessage)}`);
          setNewMessages((prevMessages) => [...prevMessages, eventData.value.data.onCreateMessage]);
        }
      });
      setSubscription(newSubscription);
    });

    return () => {
      if (subscription) {
      console.log("[TrollBox] Unsubscribing from new message subscription");
      subscription.unsubscribe();
      }
      };
      }, []);

      const handleTextChange = (e) => setText(e.target.value);
      const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(`[TrollBox] Submitting new message: ${text}`);
      const addMessage = `mutation($username: String!, $text: String!) { createMessage(input: {username: $username, text: $text}) { id username text } }`;
      const result = await API.graphql(graphqlOperation(addMessage, { username, text }));
      console.log("[TrollBox] Message submitted");
      setText("");
      };
      const handleSignOut = async () => {
      console.log("[TrollBox] Signing out");
      await Auth.signOut();
      console.log("[TrollBox] Redirecting to sign in page");
      router.push("/");
      };

      return (
      <div>
      <h1>Chat Room</h1>
      {isLoading ? (
      <div>Loading...</div>
      ) : (
      messages.map((message) => (
      <div key={message.id}>
      <strong>{message.username}: </strong>
      {message.text}
      </div>
      ))
      )}
      <form onSubmit={handleSubmit}>
      <label htmlFor="messageInput">Enter your message:</label>
      <input id="messageInput" type="text" value={text} onChange={handleTextChange} />
      <button type="submit">Send</button>
      </form>
      <button onClick={handleSignOut}>Sign Out</button>
      </div>
      );
      };

      export default TrollBox;
