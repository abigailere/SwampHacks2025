import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [steamId, setSteamId] = useState('');
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState(''); // To show a message if something goes wrong

  const fetchProfile = async () => {
    if (!steamId.trim()) {
      setMessage('Please enter a valid Steam ID.');
      setProfile(null);
      return;
    }

    setMessage('Fetching profile...');
    try {
      // Replace the URL with your backend URL or Steam API endpoint
      const response = await axios.get(`http://localhost:3000/api/user/${steamId}`);
      if (response.data) {
        setProfile(response.data);
        setMessage('');
      } else {
        setMessage('Profile not found.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Error fetching profile. Please try again.');
    }
  };

  return (
    <div className="App" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Steam Profile Viewer</h1>
      <input
        type="text"
        placeholder="Enter Steam ID"
        value={steamId}
        onChange={(e) => setSteamId(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={fetchProfile} style={{ padding: '5px 10px' }}>
        Fetch Profile
      </button>
      {message && <p style={{ color: 'blue' }}>{message}</p>}
      {profile && (
        <div style={{ marginTop: '20px', textAlign: 'left', display: 'inline-block' }}>
          <h2>{profile.personaname}</h2>
          <img src={profile.avatarfull} alt="Avatar" style={{ borderRadius: '50%' }} />
          <p>
            Profile URL: <a href={profile.profileurl} target="_blank" rel="noreferrer">{profile.profileurl}</a>
          </p>
          <p>Status: {profile.personastate === 1 ? 'Online' : 'Offline/Invisible'}</p>
        </div>
      )}
    </div>
  );
}

export default App;
