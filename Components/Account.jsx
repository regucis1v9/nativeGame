import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Audio } from 'expo-av';

export default function Account() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const buttonSoundRef = useRef(null);

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
            buttonSoundRef.current = sound;
        };

        loadButtonClickSound();

        return () => {
            if (buttonSoundRef.current) {
                buttonSoundRef.current.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        loadFont();
    }, []);

    const handleRegister = async () => {
        if (buttonSoundRef.current) {
            buttonSoundRef.current.replayAsync();
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        const registerData = {
            name: username,
            password: password,
            email: email,
        };

        try {
            const response = await fetch('http://172.20.10.11/api/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error('Invalid JSON response');
            }

            if (data.error) {
                Alert.alert(data.error);
                return;
            }
            Alert.alert('Register successful!');
            console.log(data);
            // navigation.navigate('Landing');
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('An error occurred', error.message);
        }
    };

    const handleGoBack = () => {
        if (buttonSoundRef.current) {
            buttonSoundRef.current.replayAsync();
        }
        navigation.goBack();
    };

    return (
        <View className="flex-1 items-center justify-center bg-gray-900">
            <View className="flex bg-[#222034] border-2 border-[#FCB700] p-6 justify-center items-center w-5/6">
                {fontLoaded && (
                    <>
                        <Image source={require('../assets/gameLogo.png')} className="opacity-100 h-28" />
                        <Text style={{ fontFamily: "PixelifySans" }} className="text-[#FCB700] text-4xl font-extrabold mb-5">Profile Editor</Text>
                        <View className="w-11/12">
                            <TextInput
                                style={{ fontFamily: "PixelifySans" }}
                                className="h-10 border border-[#FCB700] px-4 mb-3 text-[#FCB700] placeholder-primary"
                                placeholder="New Username"
                                value={username}
                                onChangeText={setUsername}
                                onFocus={() => buttonSoundRef.current && buttonSoundRef.current.replayAsync()}
                            />
                            <TextInput
                                style={{ fontFamily: "PixelifySans" }}
                                className="h-10 border border-[#FCB700] px-4 mb-3 text-[#FCB700] placeholder-primary"
                                placeholder="New E-mail"
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => buttonSoundRef.current && buttonSoundRef.current.replayAsync()}
                            />
                            <TextInput
                                style={{ fontFamily: "PixelifySans" }}
                                className="h-10 border border-[#FCB700] px-4 mb-3 text-[#FCB700] placeholder-primary"
                                placeholder="New Password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => buttonSoundRef.current && buttonSoundRef.current.replayAsync()}
                            />
                            <TextInput
                                style={{ fontFamily: "PixelifySans" }}
                                className="h-10 border border-[#FCB700] px-4 text-[#FCB700] placeholder-primary"
                                placeholder="Confirm new password"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                onFocus={() => buttonSoundRef.current && buttonSoundRef.current.replayAsync()}
                            />
                        </View>
                        <Pressable className="w-60 h-20 flex items-center justify-center mt-20 mb-4" onPress={handleRegister}>
                            <Image source={require('../assets/Save.jpg')} className="opacity-100 scale-75" />
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
