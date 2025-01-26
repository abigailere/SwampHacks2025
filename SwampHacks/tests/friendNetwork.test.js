const { getFriendsList } = require('../src/steamApi.js');
const mockAxios = require('axios');

jest.mock('axios');

describe('Steam Friend Network Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getFriendsList should return friends for valid Steam ID', async () => {
        const mockResponse = {
            data: {
                friendslist: {
                    friends: [
                        { steamid: '12345' },
                        { steamid: '67890' }
                    ]
                }
            }
        };
        mockAxios.get.mockResolvedValue(mockResponse);

        const result = await getFriendsList('validSteamId', 'testApiKey');
        expect(result).toEqual(mockResponse.data.friendslist.friends);
    });

    test('getFriendsList should handle errors gracefully', async () => {
        mockAxios.get.mockRejectedValue(new Error('API Error'));
        const result = await getFriendsList('invalidId', 'testApiKey');
        expect(result).toEqual([]);
    });
});