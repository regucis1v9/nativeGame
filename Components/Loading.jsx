import React, { useEffect, useState } from 'react';
import { Animated, StatusBar, Text, View, Image, TouchableOpacity } from 'react-native';
import * as Font from "expo-font";

export default function Loading({ navigation }) {
    const [fontLoaded, setFontLoaded] = useState(false); // Define fontLoaded state

    const navigateToProfile = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Landing' }], // Navigate to Landing screen
        });
    };

    async function loadFont() {
        await Font.loadAsync({
            'PixelifySans': require('../assets/fonts/PixelifySans-VariableFont_wght.ttf'),
        }).catch(error => {
            console.error('Error loading font:', error);
        });
        setFontLoaded(true); // Set fontLoaded to true after loading font
    }

    const [logoFadeAnim] = useState(new Animated.Value(0));
    const [textFadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(
            logoFadeAnim,
            {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true
            }
        ).start();

        loadFont(); // Call loadFont here

        setTimeout(() => {
            Animated.timing(
                textFadeAnim,
                {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }
            ).start();
        }, 1000);
    }, []);

    if (!fontLoaded) {
        // Return a loading indicator until font is loaded
        return <View><Text>Loading...</Text></View>;
    }

    return (
        <TouchableOpacity
            className="flex-1 items-center justify-center bg-gray-900"
            onPress={navigateToProfile}
        >
            <Animated.View
                style={{
                    opacity: logoFadeAnim,
                    marginBottom: 20
                }}
            >
                <Image
                    source={require('../assets/gameLogo.png')}
                    className=""
                />
            </Animated.View>
            <Animated.View
                style={{
                    opacity: textFadeAnim,
                }}
            >
                <Text style={{ fontFamily: "PixelifySans" }} className="text-[#FCB700] text-sm mt-4 uppercase opacity-75">Press anywhere to continue</Text>
            </Animated.View>
        </TouchableOpacity>
    );
}
