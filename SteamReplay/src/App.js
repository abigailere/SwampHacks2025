import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [steamId, setSteamId] = useState('');
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  const fetchProfile = async () => {
    if (!steamId.trim()) {
      setMessage('Please enter a valid Steam ID.');
      setProfile(null);
      return;
    }

    setMessage('Fetching profile...');
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${steamId}`);
      setProfile(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Error fetching profile. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Steam Profile Viewer</h1>
      <input
        type="text"
        placeholder="Enter Steam ID"
        value={steamId}
        onChange={(e) => setSteamId(e.target.value)}
        style={{ padding: '5px', marginRight: '10px', width: '250px' }}
      />
      <button onClick={fetchProfile} style={{ padding: '5px 10px' }}>
        Fetch Profile
      </button>
      <div style={{ marginTop: '20px' }}>
        {message && <p>{message}</p>}
        {profile && (
          <div>
            <h2>{profile.personaname}</h2>
            <img src={profile.avatarfull} alt="Profile Avatar" style={{ borderRadius: '50%' }} />
            <p>
              <a href={profile.profileurl} target="_blank" rel="noopener noreferrer">
                View Steam Profile
              </a>
            </p>
            <p>Real Name: {profile.realname || 'N/A'}</p>
            <p>Location: {profile.loccountrycode || 'N/A'}</p>
            <p>Last Online: {new Date(profile.lastlogoff * 1000).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
