import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Landing() {
  const navigation = useNavigation();

  return (   
    <View className="flex-1 items-center bg-gray-900">
      <Image
        source={require('../assets/logo.png')}
        className="w-100 h-100"
      />
      <Pressable onPress={() => navigation.navigate('Game')}>
        <Image
          source={require('../assets/Play.png')}
          className="w-100 h-100 scale-75"
        />
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Store')}>
        <Image
          source={require('../assets/Store.png')}
          className="w-100 h-100 scale-75"
        />
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Leaderboard')}>
        <Image
          source={require('../assets/Leaderboard.png')}
          className="w-100 h-100 scale-75"
        />
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Image
          source={require('../assets/Login.png')}
          className="w-100 h-100 scale-75"
        />
      </Pressable>
    </View>
  );
