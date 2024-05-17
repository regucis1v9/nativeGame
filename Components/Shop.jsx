import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Pressable, Text, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import storage from './Storage';

export default function Shop() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [backgroundSound, setBackgroundSound] = useState(null);
    const [buttonSound, setButtonSound] = useState(null);
    const [coins, setCoins] = useState();
    const [ownedItems, setOwnedItems] = useState([]);
    const [userID, setUserID] = useState();

    useEffect(() => {
        storage.load({ key: 'id' })
            .then((userID) => {
                setUserID(userID);
                console.log(userID);
            })
            .catch((error) => {
                console.error('Error loading userID:', error);
            });

        storage.load({ key: 'coins' })
            .then((coins) => {
                setCoins(coins);
            })
            .catch((error) => {
                console.error('Error loading coins:', error);
            });

        loadOwnedItems();
    }, [isFocused]);

    useEffect(() => {
        async function loadButtonClickSound() {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/button_click.mp3')
            );
            setButtonSound(sound);
        }

        loadButtonClickSound();

        return () => {
            if (buttonSound) {
                buttonSound.unloadAsync();
            }
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            async function loadAndPlayBackgroundMusic() {
                if (!backgroundSound) {
                    const { sound } = await Audio.Sound.createAsync(
                        require('../assets/sounds/shop.mp3'),
                        { isLooping: true }
                    );
                    setBackgroundSound(sound);
                    await sound.playAsync();
                }
            }

            async function stopBackgroundMusic() {
                if (backgroundSound) {
                    await backgroundSound.stopAsync();
                }
            }

            loadAndPlayBackgroundMusic();

            return () => {
                stopBackgroundMusic();
            };
        }, [backgroundSound])
    );

    const playButtonClickSound = async () => {
        if (buttonSound) {
            await buttonSound.replayAsync();
        }
    };

    const updateCoinsOnServer = async (newBalance) => {
        try {
            const coinData = { userID, balance: newBalance };
            const response = await fetch('http://172.20.10.11/api/updateCoins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(coinData),
            });

            const data = await response.json();

            if (data.error) {
                console.log(coinData);
                Alert.alert(data.error);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    const changeColor = async (color, price, itemID) => {
        if (ownedItems.includes(itemID)) {
            Alert.alert("Item equipped");
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

        const newBalance = -price// Subtract the price from the current balance
        const updateSuccess = await updateCoinsOnServer(newBalance);
        if (!updateSuccess) return;

        setCoins(coins - price);
        Alert.alert("Item bought");
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

    const addShield = async (price, itemID) => {
        if (ownedItems.includes(itemID)) {
            Alert.alert("Item already owned");
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

        const newBalance = -price; // Subtract the price from the current balance
        const updateSuccess = await updateCoinsOnServer(newBalance);
        if (!updateSuccess) return;

        setCoins(coins - price);
        Alert.alert("Item bought");
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

    const setSound = async (music, price, itemID) => {
        if (ownedItems.includes(itemID)) {
            Alert.alert("Item equipped");
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

        const newBalance = -price; // Subtract the price from the current balance
        const updateSuccess = await updateCoinsOnServer(newBalance);
        if (!updateSuccess) return;

        setCoins(coins - price);
        Alert.alert("Item bought");
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

    const loadOwnedItems = () => {
        storage.load({
            key: 'ownedItems'
        }).then(items => {
            setOwnedItems(items || []);
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
