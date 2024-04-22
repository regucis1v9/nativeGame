import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Audio } from 'expo-av';
import 'tailwindcss/tailwind.css';

export default function Leaderboard() {
    const navigation = useNavigation();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [buttonSound, setButtonSound] = useState(null);

    // Function to load the font
    async function loadFont() {
        await Font.loadAsync({
            'PixelifySans': require('../assets/fonts/PixelifySans-VariableFont_wght.ttf'),
        }).catch((error) => {
            console.error('Error loading font:', error);
        });
        setFontLoaded(true);
    }

    // Load the font when the component mounts
    useEffect(() => {
        loadFont();
    }, []);

    // Load the button click sound
    useEffect(() => {
        async function loadButtonClickSound() {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/button_click.mp3')
            );
            setButtonSound(sound);
        }

        loadButtonClickSound(); // Load the sound on mount

        return () => {
            if (buttonSound) {
                buttonSound.unloadAsync(); // Unload sound on unmount
            }
        };
    }, []); // Run this effect only once when the component mounts

    // Function to play the button click sound
    const playButtonClickSound = async () => {
        if (buttonSound) {
            await buttonSound.replayAsync();
        }
    };

    // Sample leaderboard data
    const leaderboardData = [
        { rank: 1, username: 'User1', score: 1000 },
        { rank: 2, username: 'User2', score: 900 },
        { rank: 3, username: 'User3', score: 800 },
        { rank: 4, username: 'User1', score: 1000 },
        { rank: 5, username: 'User2', score: 900 },
        { rank: 6, username: 'User3', score: 800 },
        { rank: 7, username: 'User1', score: 1000 },
        { rank: 8, username: 'User2', score: 900 },
        { rank: 9, username: 'User3', score: 800 },
        { rank: 10, username: 'User3', score: 800 },
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
                    {/* Button to navigate back to Landing */}
                    <Pressable
                        onPress={() => {
                            playButtonClickSound(); // Play sound on button press
                            navigation.navigate('Landing'); // Navigate back to Landing
                        }}
                        className="mt-4"
                    >
                        <Image
                            source={require('../assets/Back.png')}
                            className="w-100 scale-75" // Adjust size as needed
                        />
                    </Pressable>
                </View>
            )}
        </View>
    );
}
