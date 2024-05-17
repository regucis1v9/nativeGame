import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Audio } from 'expo-av';

export default function Register() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const handleRegister = async () => {
        // Play button click sound
        if (buttonSound) {
            buttonSound.replayAsync();
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://172.20.10.11/api/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'User registered successfully');
            } else {
                Alert.alert('Error', data.error || 'Failed to register');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to register: ' + error.message);
        }
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
                        <Text style={{ fontFamily: "PixelifySans"}} className="text-[#FCB700] text-4xl font-extrabold mb-5">Register</Text>
                        <View className="w-11/12">
                            <TextInput
                                style={{ fontFamily: "PixelifySans"}}
                                className="h-10 border border-[#FCB700] px-4 mb-3 text-[#FCB700] placeholder-primary"
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                                onFocus={() => buttonSound && buttonSound.replayAsync()}
                            />
                            <TextInput
                                style={{ fontFamily: "PixelifySans" }}
                                className="h-10 border border-[#FCB700] px-4 mb-3 text-[#FCB700] placeholder-primary"
                                placeholder="E-mail"
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => buttonSound && buttonSound.replayAsync()}
                            />
                            <TextInput
                                style={{ fontFamily: "PixelifySans" }}
                                className="h-10 border border-[#FCB700] px-4 mb-3 text-[#FCB700] placeholder-primary"
                                placeholder="Password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => buttonSound && buttonSound.replayAsync()}
                            />
                            <TextInput
                                style={{ fontFamily: "PixelifySans" }}
                                className="h-10 border border-[#FCB700] px-4 text-[#FCB700] placeholder-primary"
                                placeholder="Confirm password"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                onFocus={() => buttonSound && buttonSound.replayAsync()}
                            />
                        </View>
                        <Pressable className="w-60 h-20 flex items-center justify-center mt-20 mb-4" onPress={handleRegister}>
                            <Image source={require('../assets/Register.jpg')} className="opacity-100 scale-75" />
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
