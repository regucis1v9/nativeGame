import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import 'tailwindcss/tailwind.css';

export default function Landing({navigation}) {
  return (   
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="color-white">Landing</Text>
        <StatusBar style="auto" />
      </View>
  );
}