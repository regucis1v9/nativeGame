import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, View, Image } from 'react-native';
import 'tailwindcss/tailwind.css';

export default function Landing() {
  return (   
    <View className="flex-1 items-center bg-gray-900">
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
      <Pressable>
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
