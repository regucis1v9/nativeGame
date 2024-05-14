import React, { useEffect, useState } from 'react';
import { Animated, Text, View, Image, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import { Audio } from 'expo-av';

export default function Loading({ navigation }) {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [backgroundSound, setBackgroundSound] = useState(null);
    const [buttonSound, setButtonSound] = useState(null);
    const [logoFadeAnim] = useState(new Animated.Value(0));
    const [textFadeAnim] = useState(new Animated.Value(0));
    const [loadingFadeAnim] = useState(new Animated.Value(1));

    const navigateToLanding = async () => {
        if (buttonSound) {
            await buttonSound.replayAsync(); // Play the button click sound
        }
        navigation.reset({
            index: 0,
            routes: [{ name: 'Landing' }],
        });
    };

    const loadFont = async () => {
        try {
            await Font.loadAsync({
                'PixelifySans': require('../assets/fonts/PixelifySans-VariableFont_wght.ttf'),
            });
            setFontLoaded(true); // Set fontLoaded to true when font is loaded
        } catch (error) {
            console.error('Error loading font:', error); // Log the error
        }
    };

    useEffect(() => {
        loadFont(); // Load the font asynchronously

        async function loadAndPlayBackgroundMusic() {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/loaded.mp3'),
                { isLooping: false }
            );
            setBackgroundSound(sound);
            await sound.playAsync(); // Play background sound once
        }

        async function loadButtonClickSound() {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/button_click.mp3')
            );
            setButtonSound(sound);
        }

        loadAndPlayBackgroundMusic(); // Load and play background sound
        loadButtonClickSound(); // Load the button click sound

        Animated.timing(logoFadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();

        Animated.timing(textFadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();

        Animated.timing(loadingFadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        return () => {
            if (backgroundSound) {
                backgroundSound.unloadAsync(); // Unload background sound
            }
            if (buttonSound) {
                buttonSound.unloadAsync(); // Unload button sound
            }
        };
    }, []); // Ensure useEffect runs only once when component mounts

    if (!fontLoaded) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-900">
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity
            className="flex-1 items-center justify-center bg-gray-900"
            onPress={navigateToLanding}
        >
            <Animated.Image
                source={require('../assets/Loading.gif')}
                className="opacity-100 -z-50 absolute"
                style={{
                    opacity: loadingFadeAnim,
                }}
            />
            <Animated.View
                style={{
                    opacity: logoFadeAnim,
                    marginBottom: 20,
                }}
            >
                <Image source={require('../assets/gameLogo.png')} />
            </Animated.View>
            <Animated.View
                style={{
                    opacity: textFadeAnim,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PixelifySans',
                        color: '#FCB700',
                        marginTop: 4,
                        textTransform: 'uppercase',
                        opacity: 0.75,
                    }}
                    classname="font-s"
                >
                    Press anywhere to continue
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
}
