import React from 'react';
import { Pressable, View, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the necessary hook
import 'tailwindcss/tailwind.css';
import Leaderboard from "./Leaderboard";

export default function Landing() {
    const navigation = useNavigation(); // Use useNavigation hook to get the navigation prop

    const navigate = () => {
        navigation.navigate('Leaderboard'); // Use navigation prop to navigate to Leaderboard screen
    };

    return (
        <View className="flex-1 items-center bg-gray-900">
            <StatusBar hidden />
            <Image
                source={require('../assets/logo.png')} // Load PNG as static asset
                className="w-100 h-100" // Adjust width and height using classNames
            />
            <Pressable>
                <Image className="scale-75"
                       source={require('../assets/Play.png')} // Load PNG as static asset// Adjust width and height using classNames
                />
            </Pressable>
            <Pressable>
                <Image className="scale-75"
                       source={require('../assets/Store.png')} // Load PNG as static asset// Adjust width and height using classNames
                />
            </Pressable>
            <Pressable onPress={navigate}>
                <Image className="scale-75"
                       source={require('../assets/Leaderboard.png')} // Load PNG as static asset// Adjust width and height using classNames
                />
            </Pressable>
            <Pressable>
                <Image className="scale-75"
                       source={require('../assets/Login.png')} // Load PNG as static asset// Adjust width and height using classNames
                />
            </Pressable>
        </View>
    );
}
