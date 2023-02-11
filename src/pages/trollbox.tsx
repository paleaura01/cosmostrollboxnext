import React, { useState, useEffect } from "react";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { useRouter } from 'next/router'

const TrollBox = () => {
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userPool = new CognitoUserPool({
      UserPoolId: "us-east-1_Rb5Wn84th",
      ClientId: "9h486bll3noi9dh3h0eqf0601",
    });
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      console.log("Cognito user:", cognitoUser);
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Session:", session);
          setUsername(session.getIdToken().payload.username);
        }
      });
    } 
    
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
      setMessages(data.data.listMessages.items);
      setIsLoading(false);
    });
  }, []);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const addMessage = `mutation($username: String!, $text: String!) {
      createMessage(input: {username: $username, text: $text}) {
        id
        username
        text
      }
    }`;
    const result = await API.graphql(
      graphqlOperation(addMessage, { username, text })
    );
    setMessages([...messages, result.data.createMessage]);
    setText("");
  };

  const handleSignOut = () => {
    Auth.signOut().then(() => {
      router.push("/");
    });
  };

  return (
<div>
      <h1>Chat Room</h1>
      <div>
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
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={text} onChange={handleTextChange} />
        <button type="submit">Send</button>
      </form>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};
export default TrollBox;