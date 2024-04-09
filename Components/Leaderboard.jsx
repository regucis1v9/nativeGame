import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Font from 'expo-font';
import 'tailwindcss/tailwind.css';

export default function Leaderboard() {
    const [fontLoaded, setFontLoaded] = useState(false);

    async function loadFont() {
        await Font.loadAsync({
            'PixelifySans': require('../assets/fonts/PixelifySans-VariableFont_wght.ttf'),
        }).catch(error => {
            console.error('Error loading font:', error);
        });
        setFontLoaded(true);
    }

    useEffect(() => {
        loadFont();
    }, []);
    const leaderboardData = [
        { rank: 1, username: 'User1', score: 1000 },
        { rank: 2, username: 'User2', score: 900 },
        { rank: 3, username: 'User3', score: 800 },
        { rank: 4, username: 'User1', score: 700 },
        { rank: 5, username: 'User2', score: 600 },
        { rank: 6, username: 'User3', score: 500 },
        { rank: 7, username: 'User1', score: 400 },
        { rank: 8, username: 'User2', score: 300 },
        { rank: 9, username: 'User3', score: 200 },
    ];

    return (
        <View className="flex-1 justify-center items-center bg-gray-900">
            {fontLoaded && (
                <View>
                    <Text style={{ fontFamily: "PixelifySans" }} className="text-white text-4xl">Leaderboard</Text>
                    {leaderboardData.map((user) => (
                        <View key={user.rank} className="flex-row justify-between items-center bg-gray-800 p-2 my-2 rounded">
                            <Text style={{ fontFamily: "PixelifySans" }} className="text-white text-xl">{user.rank}. {user.username}</Text>
                            <Text style={{ fontFamily: "PixelifySans" }} className="text-white text-xl">{user.score}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
