const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Replace with your Steam Web API key
const API_KEY = '';

// Enable CORS for all requests (so your frontend can make API calls to this backend)
app.use(cors());

// Route to fetch Steam profile data
app.get('/api/user/:steamId', async (req, res) => {
  const { steamId } = req.params;

  // Steam API endpoint to fetch user summaries
  const steamAPIUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`;

  try {
    const response = await axios.get(steamAPIUrl, {
      params: {
        key: API_KEY,
        steamids: steamId,
      },
    });

    // Extract player data from Steam API response
    const players = response.data.response.players;
    if (players && players.length > 0) {
      res.json(players[0]); // Send the first player's profile data
    } else {
      res.status(404).json({ message: 'Steam profile not found.' });
    }
  } catch (error) {
    console.error('Error fetching data from Steam API:', error.message);
    res.status(500).json({ message: 'Failed to fetch profile data.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${3000}`);
});
