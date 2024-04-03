import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View, Button } from 'react-native';
import 'tailwindcss/tailwind.css';

export default function Loading({navigation}) {
  return (   
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="color-white">Laoding</Text>
        <StatusBar style="auto" />
        <Button
            title="Press anywhere to continue"
            onPress={() =>
                navigation.navigate('Landing')
            }
        />
      </View>
  );
}