import React, { useEffect, useState } from 'react';
import { View, Image, Pressable, Text, TextInput, Keyboard, Alert, Screen, Button } from 'react-native';
import Background from './Background';
import * as Font from 'expo-font';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import storage from './Storage';

export default function Payment() {
    const navigation = useNavigation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [buttonSound, setButtonSound] = useState(null); 
    const [inputValue, setInputValue] = useState(0);
    const [currCoins, setCurrCoins] = useState(0);
    const [userID, setUserID] = useState();
    const [error, setError] = useState("");
    const [buttonPressed, setButtonPressed] = useState(false);
    const [loading, setLoading] = useState(true); // Set to true initially
    const [paymentIntentData, setPaymentIntentData] = useState(null);
    const [inProgress, setInProgress] =  useState(false)

    const updateCoins = (coins) =>{
        storage.save({
            key: 'coins',
            data: coins,
        });
    }

    useEffect(() => {

        storage.load({ key: 'coins' })
        .then((coins) => {
            setCurrCoins(coins);
            console.log(coins)
        })
        .catch((error) => {
            console.error('Error loading  coins:', error);
            
        });
        storage.load({ key: 'id' })
        .then((userID) => {
            setUserID(userID);
            console.log(userID)
        })
        .catch((error) => {
            console.error('Error loading  userID:', error);
            
        });

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

    const playButtonClickSound = async () => {
        if (buttonSound) {
            await buttonSound.replayAsync();
        }
    };

    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`http://172.20.10.11/api/createPaymentIntent?coinAmount=${inputValue}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { paymentIntent, ephemeralKey, customer } = await response.json();
    
        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };    
      const initializePaymentSheet = async () => {
        const {
          paymentIntent,
          ephemeralKey,
          customer,
          publishableKey,
        } = await fetchPaymentSheetParams();
    
        const { error } = await initPaymentSheet({
          merchantDisplayName: "CosmoRunner Inc.",
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            name: 'Jane Doe',
          },
          returnURL: 'your-app://shop', // Add the returnURL here
        });
        if (!error) {
          setLoading(true);
        }
      };


      const buyCoins = async () => {
        if(inProgress){
            return
        }
        setInProgress(true)
        playButtonClickSound();
        setButtonPressed(true);
        if (inputValue === '' || inputValue <= 0) {
            setError("Enter a valid value");
        } else {
            setError("Please wait");
            await initializePaymentSheet();
            const paymentResponse = await presentPaymentSheet();
            if(paymentResponse.error){
                setError(paymentResponse.error.message)
                return;
            } else {
                setError('Your order is confirmed!');
                const coinsToAdd = parseInt(currCoins) + parseInt(inputValue); // Convert to numbers
                console.log(coinsToAdd);
                updateCoins(coinsToAdd);
                console.log(userID, inputValue)
                const coinData = {
                    userID: userID,
                    balance: inputValue,
                };
                try {
                    const response = await fetch('http://172.20.10.11/api/updateCoins', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(coinData),
                    });
        
                    const data = await response.json();
        
                    if(data.error){
                        console.log(loginData)
                        Alert.alert(data.error)
                        return;
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
        setInProgress(false)
    };
    
    
    const handleTextChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setInputValue(numericText);
    };
    return (
        <>
            <View className="flex-1 items-center z-20">
                <Pressable className="h-screen w-screen absolute z-20" onPress={Keyboard.dismiss}></Pressable>
                <Text style={{ fontFamily: 'PixelifySans' }} className="text-white text-3xl w-full text-center mt-40">Select a coin amount</Text>
                <Image
                    source={require('../assets/sprites/coins/customCoin2x5.png')}
                    className="mt-16"
                />
                <Image
                    source={require('../assets/sprites/coins/customCoin2x5.png')}
                    className="mt-[-50] mr-10"
                />
                <Image
                    source={require('../assets/sprites/coins/customCoin2x5.png')}
                    className="mt-[-85] ml-10"
                />
                <View className="flex flex-row">
                    <Image
                        source={require('../assets/sprites/coins/customCoin2.png')}
                        className="scale-150 mt-10"
                    />
                    <Text style={{ fontFamily: 'PixelifySans' }} className="text-white mt-10 ml-2"> = 0.50</Text>
                    <Text className="text-white mt-10"t>$</Text>
                </View>
                <TextInput 
                    style={{ fontFamily: 'PixelifySans' }} 
                    keyboardType="number-pad" 
                    className="border-solid border-white border-b-2 w-2/6 mt-20 z-30 text-white text-2xl h-10 text-center" 
                    onChangeText={handleTextChange}
                />
                <Text style={{ fontFamily: 'PixelifySans' }}  className="text-red-500 text-xl mt-2 h-6">{error}</Text>
                <Pressable
                    onPress={buyCoins}
                    className="z-30"
                >
                    <Image
                        source={require('../assets/BuyCoins.jpg')}
                        className="w-100 h-100 scale-75 mt-20"
                    />
                </Pressable>
                <Pressable
                    onPress={() => { playButtonClickSound(); navigation.navigate('Shop'); }}
                    className="z-30"
                >
                    <Image
                        source={require('../assets/Back.png')}
                        className="w-100 h-100 scale-50 z-30"
                    />
                </Pressable>
            </View>
            <View className="absolute w-screen h-screen z-0">
                <Background/>
            </View>
        </>
    );
}
