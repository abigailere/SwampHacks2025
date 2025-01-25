
var Express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const axios = require("axios");

var app = Express();
app.use(cors());
app.use(Express.json());

var CONNECTION_STRING = "mongodb+srv://admin:Pinksand2go!@cluster0.bkye1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var DATABASENAME = "SwampHacks";
var database;

const STEAM_API_KEY = "8CC50B5636A1675EFCB7A6EC699ADADC";

async function getSteamId(username) {
    const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${username}`;
    try {
        const response = await axios.get(url);
        return response.data.response.steamid;
    } catch (error) {
        console.error("Error getting Steam ID:", error.message);
        return null;
    }
}

async function getOwnedGames(steamId) {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=1`;
    try {
        const response = await axios.get(url);
        return response.data.response.games || [];
    } catch (error) {
        console.error("Error getting owned games:", error.message);
        return [];
    }
}

async function getBasicSteamInfo(steamId) {
    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`;
    try {
        const response = await axios.get(url);
        if (response.data && response.data.response && response.data.response.players) {
            return response.data.response.players[0];
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error("Error getting basic Steam info:", error.message);
        return null;
    }
}

app.post("/api/scrape-steam", async (req, res) => {
    const { steamId } = req.body;
    if (steamId) {
        const games = await getOwnedGames(steamId);
        const basicInfo = await getBasicSteamInfo(steamId);
        const userGames = {
            steamId: steamId,
            username: basicInfo ? basicInfo.personaname : 'Unknown',
            games: games
        };
        
        try {
            await database.collection("steam_users").updateOne(
                { steamId: steamId },
                { $set: userGames },
                { upsert: true }
            );
            res.json(userGames);
        } catch (error) {
            res.status(500).json({ error: "Error saving to database" });
        }
    } else {
        res.status(400).json({ error: "Steam ID is required" });
    }
});


app.get("/api/steam-info/:steamId", async (req, res) => {
    const { steamId } = req.params;
    try {
        const steamInfo = await getBasicSteamInfo(steamId);
        if (steamInfo) {
            res.json(steamInfo);
        } else {
            res.status(404).json({ error: "Steam information not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching Steam information" });
    }
});

MongoClient.connect(CONNECTION_STRING)
    .then(client => {
        database = client.db(DATABASENAME);
        console.log("MongoDB Connection Successful");
        
        app.listen(5038, () => {
            console.log("Server is running on port 5038");
            // Test the scrape-steam endpoint with the Steam ID "76561198229408012"
            testScrapeWithSteamId("76561198229408012");
        });
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });


    async function testScrapeWithSteamId(steamId) {
        try {
            const response = await axios.post('http://localhost:5038/api/scrape-steam', { steamId });
            console.log('Scraped data:', response.data);
        } catch (error) {
            console.error('Error scraping data:', error.response ? error.response.data : error.message);
        }
    }
    
    

    



    /*
    const MongoClient = require('mongodb').MongoClient;

    const CONNECTION_STRING = "mongodb+srv://admin:Pinksand2go!@cluster0.bkye1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const DATABASENAME = "SwampHacks";
    
    async function addUserToDatabase(steamId, username) {
        try {
            // Connect to the MongoDB database
            const client = await MongoClient.connect(CONNECTION_STRING);
            const db = client.db(DATABASENAME);
            
            // Select the collection
            const collection = db.collection('steam_users');
    
            // Create a new user object
            const newUser = {
                steamId: steamId,
                username: username
            };
    
            // Insert the new user into the collection
            const result = await collection.insertOne(newUser);
    
            console.log(`User added with ID: ${result.insertedId}`);
    
            // Close the connection
            client.close();
    
            return result.insertedId;
        } catch (error) {
            console.error("Error adding user to database:", error);
        }
    }
    
    // Example usage
    addUserToDatabase("123456789", "example_user")
        .then(() => console.log("User addition complete"))
        .catch(error => console.error("Error:", error));
*/    