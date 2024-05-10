import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Background from './Background';
import { useFocusEffect } from '@react-navigation/native'; // Importing useFocusEffect
import { Audio } from 'expo-av';
export default function Landing() {
    const navigation = useNavigation();
    const [backgroundSound, setBackgroundSound] = useState(null); // State for background music
    const [buttonSound, setButtonSound] = useState(null); // State for button click sound

    useEffect(() => {
        async function loadButtonClickSound() {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/button_click.mp3')
            );
            setButtonSound(sound); // Store the button click sound in state
        }

        loadButtonClickSound(); // Load the button click sound once

        return () => {
            if (buttonSound) {
                buttonSound.unloadAsync(); // Unload button sound to free resources
            }
        };
    }, []); // Empty dependency array ensures this runs only once

    useFocusEffect(
        useCallback(() => {
            async function loadAndPlayBackgroundMusic() {
                if (!backgroundSound) {
                    const { sound } = await Audio.Sound.createAsync(
                        require('../assets/sounds/menu3.wav'),
                        { isLooping: true }
                    );
                    setBackgroundSound(sound); // Store background sound
                    await sound.playAsync(); // Play the background music
                }
            }

            async function stopBackgroundMusic() {
                if (backgroundSound) {
                    await backgroundSound.stopAsync(); // Stop the background music
                }
            }

            loadAndPlayBackgroundMusic(); // Play the background music when the page is focused

            return () => {
                stopBackgroundMusic(); // Stop the music when the page is unfocused
            };
        }, [backgroundSound]) // Only runs if backgroundSound state changes
    );

    const playButtonClickSound = async () => {
        if (buttonSound) {
            await buttonSound.replayAsync(); // Play button sound on press
        }
    };

    return (
        <>
        <View className="flex-1 items-center z-10">
            <Image
                source={require('../assets/gameLogo.png')}
                className="w-100 h-100 -mb-16 mt-10"
            />
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                    navigation.navigate('Game');
                }}
            >
                <Image
                    source={require('../assets/Play.png')}
                    className="w-100 h-100 scale-75"
                />
            </Pressable>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                    navigation.navigate('Shop'); // Navigate to Store screen
                }}
            >
                <Image
                    source={require('../assets/Store.png')}
                    className="w-100 h-100 scale-75"
                />
            </Pressable>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                    navigation.navigate('Leaderboard'); // Navigate to Leaderboard screen
                }}
            >
                <Image
                    source={require('../assets/Leaderboard.png')}
                    className="w-100 h-100 scale-75"
                />
            </Pressable>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                    navigation.navigate('Login'); // Navigate to Login screen
                }}
            >
                <Image
                    source={require('../assets/Login.png')}
                    className="w-100 h-100 scale-75"
                />
            </Pressable>
        </View>
        <View className="absolute w-screen h-screen z-0">
            <Background/>
        </View>
        </>
    );
}
