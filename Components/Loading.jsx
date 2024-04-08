import React, { useEffect, useState } from 'react';
import { Animated, StatusBar, Text, View, Image, TouchableOpacity } from 'react-native';

export default function Loading({ navigation }) {

  const navigateToProfile = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }], // Navigate to Landing screen
    });
  };

  const [logoFadeAnim] = useState(new Animated.Value(0)); 
  const [textFadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(
      logoFadeAnim,
      {
        toValue: 1, // Animate to opacity: 1 (fully opaque)
        duration: 3000, // Duration of the animation in milliseconds (3 seconds)
        useNativeDriver: true // Use the native driver for better performance
      }
    ).start();

    // Delay text fade animation by 3 seconds
    setTimeout(() => {
      Animated.timing(
        textFadeAnim,
        {
          toValue: 1, // Animate to opacity: 1 (fully opaque)
          duration: 1000, // Duration of the animation in milliseconds (1 second)
          useNativeDriver: true // Use the native driver for better performance
        }
      ).start();
    }, 1000);
  }, []);

  return (
    <TouchableOpacity
      className="flex-1 items-center justify-center bg-gray-900"
      onPress={navigateToProfile}
    >
      <Animated.View
        style={{
          opacity: logoFadeAnim,
          marginBottom: 20 // Add margin bottom to separate logo from text
        }}
      >
        <Image
          source={require('../assets/logo.png')} // Load PNG as static asset
          className="w-100 h-100" // Adjust width and height using classNames
        />
      </Animated.View>
      <Animated.View
        style={{
          opacity: textFadeAnim,
        }}
      >
        <Text className="text-slate-500 text-sm mt-4 uppercase">Press anywhere to continue</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
