const axios = require('axios');

async function getFriendsList(steamId, apiKey) {
    try {
        const url = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${apiKey}&steamid=${steamId}&relationship=friend`;
        const response = await axios.get(url);
        
        if (response.status === 200 && response.data.friendslist) {
            return response.data.friendslist.friends;
        }
        return [];
    } catch (error) {
        console.error(`Error fetching friends for ${steamId}:`, error.message);
        return [];
    }
}

module.exports = {
    getFriendsList
};
