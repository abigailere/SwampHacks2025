const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5001;

// Replace this with your actual Steam Web API Key
const API_KEY = '8CC50B5636A1675EFCB7A6EC699ADADC';

// Enable CORS
app.use(cors());

const path = require("path");

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});



// Route to fetch Steam profile data
app.get('/api/user/:steamId', async (req, res) => {
  const { steamId } = req.params;
  const steamAPIUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`;

  try {
    const response = await axios.get(steamAPIUrl, {
      params: {
        key: API_KEY,
        steamids: steamId,
      },
    });

    const players = response.data.response.players;
    if (players && players.length > 0) {
      res.json(players[0]); // Send the first player's profile data
    } else {
      res.status(404).json({ message: 'Steam profile not found.' });
    }
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ message: 'Failed to fetch profile data.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.get('/api/user/:steamId/games', async (req, res) => {
  const { steamId } = req.params;
  const steamAPIUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`;

  try {
    const response = await axios.get(steamAPIUrl, {
      params: {
        key: API_KEY,
        steamid: steamId,
        include_appinfo: 1,
        include_played_free_games: 1,
        format: 'json'
      },
    });

    const games = response.data.response.games;
    if (games && games.length > 0) {
      res.json(games);
    } else {
      res.status(404).json({ message: 'No games found for this user.' });
    }
  } catch (error) {
    console.error('Error fetching games:', error.message);
    res.status(500).json({ message: 'Failed to fetch games data.' });
  }
});
