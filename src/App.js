import React, { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const [user, setUser] = useState(null);
  const [instanceLaunched, setInstanceLaunched] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
const [userName, setUserName] = useState('');

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        // Safely access attributes
        console.log('Logged-in user:', user);
        const name = user.attributes.given_name || user.attributes.family_name || user.attributes.email || user.username;
        setUserName(name);
      })
      .catch(err => console.log('Error fetching user', err));
  }, []);


  const signIn = () => Auth.federatedSignIn();
  const signOut = () => Auth.signOut().then(() => setUser(null));

  const startSession = () => {
    // Placeholder URL for the terminal iframe
    setIframeUrl("https://labs.brenthollers.com/terminal");
    setInstanceLaunched(true);
  };

  const stopSession = () => {
    setIframeUrl("");
    setInstanceLaunched(false);
    // Add backend API call to stop the instance here later
  };

  if (!user) {
    return <div style={{ padding: 20 }}><button onClick={signIn}>Login</button></div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {userName}</h2>
      {!instanceLaunched ? (
        <button onClick={startSession}>Start Session</button>
      ) : (
        <div>
          <button onClick={stopSession}>Stop Session</button>
          <div style={{ marginTop: 20, height: "600px", border: "1px solid #ccc" }}>
            <iframe
              src={iframeUrl}
              title="Terminal"
              width="100%"
              height="100%"
              frameBorder="0"
            />
          </div>
        </div>
      )}
      <br /><button onClick={signOut}>Logout</button>
    </div>
  );
}

export default App;