import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Audio } from 'expo-av';
import storage from './Storage';

export default function Login() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const [buttonSound, setButtonSound] = useState(null);

    // Load custom font
    const loadFont = async () => {
        await Font.loadAsync({
            'PixelifySans': require('../assets/fonts/PixelifySans-VariableFont_wght.ttf'),
        });
        setFontLoaded(true);
    };

    // Load button click sound
    useEffect(() => {
        const loadButtonClickSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/button_click.mp3')
            );
            setButtonSound(sound);
        };

        loadButtonClickSound();

        return () => {
            if (buttonSound) {
                buttonSound.unloadAsync(); // Unload the button click sound
            }
        };
    }, []);

    useEffect(() => {
        loadFont();
    }, []);

    const handleLogin = async () => {
        // Play button click sound
        if (buttonSound) {
            buttonSound.replayAsync();
        }

        // Prepare data to be sent
        const loginData = {
            name: username,
            password: password,
        };

        try {
            // Send POST request
            const response = await fetch('http://172.20.10.11/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if(data.error){
                console.log(loginData)
                Alert.alert(data.error)
                return;
            }
            Alert.alert("Login succesful!")
            const balance = data.balance
            storage.save({
                key: 'coins',
                data: data.user.balance,
            });
            navigation.navigate('Landing');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleGoRegister = () => {
        // Play button click sound
        if (buttonSound) {
            buttonSound.replayAsync();
        }
        // Navigate to Register screen
        navigation.navigate('Register');
    };

    const handleGoBack = () => {
        // Play button click sound
        if (buttonSound) {
            buttonSound.replayAsync();
        }
        // Navigate back
        navigation.goBack();
    };

    return (
        <View className="flex-1 items-center justify-center bg-gray-900">
            <View className="flex bg-[#222034] border-2 border-[#FCB700] p-6 justify-center items-center w-5/6">
                {fontLoaded && (
                    <>
                        <Image source={require('../assets/gameLogo.png')} className="opacity-100 h-28" />
                        <Text style={{ fontFamily: "PixelifySans" }} className="text-[#FCB700] text-4xl font-extrabold mb-5">Login</Text>
                        <View className="w-11/12">
                            <TextInput
                                style={{ fontFamily: "PixelifySans" }}
                                className="h-12 border border-[#FCB700] px-4 mb-3 text-[#FCB700] placeholder-primary"
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                                onFocus={() => buttonSound.replayAsync()}
                            />
                            <TextInput
                                style={{ fontFamily: "PixelifySans" }}
                                className="h-12 border border-[#FCB700] px-4 text-[#FCB700] mb-10 placeholder-primary"
                                placeholder="Password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => buttonSound.replayAsync()}
                            />
                        </View>
                        <Pressable className="w-60 h-20 flex items-center justify-center mt-20 mb-1" onPress={handleLogin}>
                            <Image source={require('../assets/Login.png')} className="opacity-100 scale-75" />
                        </Pressable>
                        <Pressable className="w-60 h-20 flex items-center justify-center rounded-md mb-1" onPress={handleGoRegister}>
                            <Image source={require('../assets/NewUser.jpg')} className="opacity-100 scale-75" />
                        </Pressable>
                        <Pressable className="w-60 h-20 flex items-center justify-center rounded-md" onPress={handleGoBack}>
                            <Image source={require('../assets/Back.png')} className="opacity-100 scale-75" />
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
}
