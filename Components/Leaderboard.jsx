import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Audio } from 'expo-av';
import Background from './Background';
import 'tailwindcss/tailwind.css';

export default function Leaderboard() {
    const navigation = useNavigation();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [buttonSound, setButtonSound] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);

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

    // Fetch leaderboard data from the server
    useEffect(() => {
        fetch('http://172.20.10.11/api/getGamesData')
            .then(response => response.json())
            .then(data => {
                setLeaderboardData(data.gamesData);
            })
            .catch(error => {
                console.error('Error fetching leaderboard data:', error);
            });
    }, []);

    return (
        <>
        <View className="flex-1 justify-center items-center z-10">
            {fontLoaded && (
                <View>
                    <Text style={{ fontFamily: "PixelifySans" }} className="text-white text-4xl">Leaderboard</Text>
                    {leaderboardData.map((user, index) => (
                        <View key={index} className="flex-row justify-between items-center bg-gray-800 p-2 my-2 rounded">
                            <Text style={{ fontFamily: "PixelifySans" }} className="text-white text-xl">{index + 1}. {user.username}</Text>
                            <Text style={{ fontFamily: "PixelifySans" }} className="text-white text-xl">{user.gameScore}</Text>
                        </View>
                    ))}
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
        <View className="absolute w-screen h-screen z-0">
            <Background/>
        </View>
        </>
    );
}
