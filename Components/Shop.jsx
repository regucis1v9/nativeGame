import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Pressable, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native'; // Importing useFocusEffect
import { Audio } from 'expo-av';

export default function Shop() {
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
                        require('../assets/sounds/shop.mp3'),
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
        <View className="flex-1 items-center bg-gray-900">
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                }}
            >
                <Image
                    source={require('../assets/BuyCoins.jpg')}
                    className="w-100 h-100 scale-75 mt-12"
                />
            </Pressable>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                }}
            >
                <Image
                    source={require('../assets/sprites/ships/noFlames/redShipNoFlames.png')}
                    className="w-100 h-100 scale-150 rotate-45 absolute top-[140px] right-[100px]"
                />
            </Pressable>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                }}
            >
                <Image
                    source={require('../assets/sprites/ships/noFlames/purpleShipNoFlames.png')}
                    className="w-100 h-100 scale-150 rotate-45 absolute top-[260px] right-[100px]"
                />
            </Pressable>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                }}
            >
                <Image
                    source={require('../assets/sprites/ships/noFlames/goldShipNoFlames.png')}
                    className="w-100 h-100 scale-150 rotate-45 absolute top-[390px] right-[100px]"
                />
            </Pressable>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                }}
            >
                <Image
                    source={require('../assets/sprites/discs/music_disc1x2.png')}
                    className="w-100 h-100 scale-75 absolute top-[130px] left-[120px]"
                />
            </Pressable>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                }}
            >
                <Image
                    source={require('../assets/sprites/discs/music_disc2x2.png')}
                    className="w-100 h-100 scale-75 absolute top-[250px] left-[120px]"
                />
            </Pressable>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                }}
            >
                <Image
                    source={require('../assets/sprites/shields/shieldx2.png')}
                    className="w-100 h-100 scale-100 absolute top-[380px] left-[120px]"
                />
            </Pressable>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[105px] left-[120px]">"Happy"</Text>
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[195px] left-[125px]">20</Text>
            </View>
            <View>
                <Image
                    source={require('../assets/sprites/coins/customCoin2.png')}
                    className="absolute w-100 h-100 scale-150 top-[195px] left-[150px]"
                />
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[225px] left-[120px]">"Tense"</Text>
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[315px] left-[125px]">20</Text>
            </View>
            <View>
                <Image
                    source={require('../assets/sprites/coins/customCoin2.png')}
                    className="absolute w-100 h-100 scale-150 top-[315px] left-[150px]"
                />
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[350px] left-[130px]">Shield</Text>
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[445px] left-[125px]">50</Text>
            </View>
            <View>
                <Image
                    source={require('../assets/sprites/coins/customCoin2.png')}
                    className="absolute w-100 h-100 scale-150 top-[445px] left-[150px]"
                />
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[105px] right-[120px]">Red</Text>
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[210px] right-[140px]">60</Text>
            </View>
            <View>
                <Image
                    source={require('../assets/sprites/coins/customCoin2.png')}
                    className="absolute w-100 h-100 scale-150 top-[210px] right-[115px]"
                />
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[235px] right-[110px]">Purple</Text>
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[330px] right-[140px]">60</Text>
            </View>
            <View>
                <Image
                    source={require('../assets/sprites/coins/customCoin2.png')}
                    className="absolute w-100 h-100 scale-150 top-[330px] right-[115px]"
                />
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[360px] right-[120px]">Gold</Text>
            </View>
            <View>
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[465px] right-[135px]">100</Text>
            </View>
            <View>
                <Image
                    source={require('../assets/sprites/coins/customCoin2.png')}
                    className="absolute w-100 h-100 scale-150 top-[465px] right-[110px]"
                />
            </View>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                    navigation.navigate('Landing');// Navigate to Login screen
                }}
                className="mt-[550px]"
            >
                <Image
                    source={require('../assets/Back.png')}
                    className="w-100 h-100 scale-75"
                />
            </Pressable>
        </View>
    );
}
