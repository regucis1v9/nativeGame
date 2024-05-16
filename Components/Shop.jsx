import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Pressable, Text, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import storage from './Storage';

export default function Shop() {
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // Use isFocused hook
    const [backgroundSound, setBackgroundSound] = useState(null);
    const [buttonSound, setButtonSound] = useState(null);
    const [coins, setCoins] = useState();
    const [ownedItems, setOwnedItems] = useState([]);

    useEffect(() => {
        // Load coins
        storage.load({ key: 'coins' })
            .then((coins) => {
                setCoins(coins);
            })
            .catch((error) => {
                console.error('Error loading coins:', error);
            });

        // Load owned items
        loadOwnedItems();
    }, [isFocused]);

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

    const changeColor = async (color, price, itemID) => {
        if (ownedItems.includes(itemID)) {
            storage.save({
                key: 'shipColor',
                data: color,
            });
            return;
        }

        if (price > coins) {
            Alert.alert("Insufficient funds");
            return;
        }

        setCoins(coins - price);
        storage.save({
            key: 'coins',
            data: coins - price,
        });
        storage.save({
            key: 'shipColor',
            data: color,
        });

        setOwnedItems([...ownedItems, itemID]);
        storage.save({
            key: 'ownedItems',
            data: [...ownedItems, itemID],
        });
    };

    const addShield = (price, itemID) => {
        if (ownedItems.includes(itemID)) {
            storage.save({
                key: 'bonusLife',
                data: true,
            });
            return;
        }

        if (price > coins) {
            Alert.alert("Insufficient funds");
            return;
        }

        setCoins(coins - price);
        storage.save({
            key: 'coins',
            data: coins - price,
        });
        storage.save({
            key: 'bonusLife',
            data: true,
        });

        setOwnedItems([...ownedItems, itemID]);
        storage.save({
            key: 'ownedItems',
            data: [...ownedItems, itemID],
        });
    };

    const setSound = (music, price, itemID) => {
        if (ownedItems.includes(itemID)) {
            storage.save({
                key: 'gameMusic',
                data: music,
            });
            return;
        }

        if (price > coins) {
            Alert.alert("Insufficient funds");
            return;
        }

        setCoins(coins - price);
        storage.save({
            key: 'coins',
            data: coins - price,
        });
        storage.save({
            key: 'gameMusic',
            data: music,
        });

        setOwnedItems([...ownedItems, itemID]);
        storage.save({
            key: 'ownedItems',
            data: [...ownedItems, itemID],
        });
    };

    // Function to load owned items
    const loadOwnedItems = () => {
        storage.load({
            key: 'ownedItems'
        }).then(items => {
            setOwnedItems(items || []); // Initialize with empty array if no items found
        }).catch(() => {
            console.log('ownedItems not set, saving default');
            storage.save({
                key: 'ownedItems',
                data: [],
            });
        });
    };
    return (
        <View className="flex-1 items-center bg-gray-900">
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                    navigation.navigate('Payment');// Navigate to Login screen
                }}
            >
                <Image
                    source={require('../assets/BuyCoins.jpg')}
                    className="w-100 h-100 scale-75 mt-12"
                />
            </Pressable>
            <View className="flex flex-row ">
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white mr-4">{coins}</Text>
                <Image source={require('../assets/sprites/coins/customCoin2.png')}></Image>
            </View>
            <Pressable
                onPress={() => {
                    playButtonClickSound();
                    changeColor('red', 60, 1)
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
                    changeColor('purple' ,80, 2)
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
                    changeColor('gold', 100, 3)
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
                    setSound('game2,', 20, 4)
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
                    setSound('game3', 20, 5)
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
                    addShield(50 ,6)
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
                <Text style={{ fontFamily: "PixelifySans" }} className="text-white absolute top-[330px] right-[140px]">80</Text>
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
