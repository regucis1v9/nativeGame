import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, Image, Text, Pressable } from 'react-native';
import 'tailwindcss/tailwind.css';

export default function Game() {
  const playerLocationRef = useRef('middle'); // useRef for playerLocation
  const [playerLocation, setPlayerLocation] = useState('middle'); // Player location state
  const [transitionValue] = useState(new Animated.Value(0)); // We don't need to setTransitionValue
  const [boxTransitionValue] = useState(new Animated.Value(0)); // Added for box movement
  const [justifyClass, setJustifyClass] = useState('justify-between'); // State for random justify class
  const [animationStarted, setAnimationStarted] = useState(false); 
  const scoreRef = useRef(0); 

  const handlePressLeft = () => {
    if (playerLocationRef.current !== 'right') {
      setPlayerLocation(prevLocation =>
        prevLocation === 'middle' ? 'right' : 'middle'
      );
    }
  };

  const handlePressRight = () => {
    if (playerLocationRef.current !== 'left') {
      setPlayerLocation(prevLocation =>
        prevLocation === 'middle' ? 'left' : 'middle'
      );
    }
  };

  useEffect(() => {
    Animated.timing(transitionValue, {
      toValue: playerLocation === 'middle' ? 0 : playerLocation === 'left' ? -1 : 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  }, [playerLocation, transitionValue]);

  playerLocationRef.current = playerLocation;

  const getRandomJustifyClass = () => {
    const randomNum = Math.floor(Math.random() * 3) + 1;
    
    if (randomNum === 1) {
      return 'justify-start';
    } else if (randomNum === 2) {
      const pairMade = Math.random() < 0.5; // 50% chance for a pair
      if (pairMade) {
        return 'justify-between';
      } else {
        return 'justify-center';
      }
    } else {
      return 'justify-end';
    }
  };
  

  useEffect(() => {
    if (!animationStarted) {
      setTimeout(() => {
        setAnimationStarted(true);
      }, 1000); 
    } else {
      const animateBlock = () => {
        setJustifyClass(getRandomJustifyClass()); 
        Animated.timing(boxTransitionValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => {
          scoreRef.current += 1;
          boxTransitionValue.setValue(0);
          animateBlock();
        });
      };
    
      animateBlock();
    
      return () => {
        boxTransitionValue.stopAnimation();
      };
    }
  }, [animationStarted, boxTransitionValue]); 

  const renderBlackBoxes = () => {
    if (justifyClass === 'justify-between') {
      return (
        <>
          <View className="w-1/3 h-20 bg-white"></View>
          <View className="w-1/3 h-20 bg-white"></View>
        </>
      );
    } else if (justifyClass === 'justify-center') {
      return <View className="w-1/3 h-20 bg-blue-500"></View>;
    } else if (justifyClass === 'justify-start' || justifyClass === 'justify-end') {
      return (
        <>
          <View className="w-1/3 h-20 bg-red-500"></View>
          <View className="w-1/3 h-20 bg-red-500"></View>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <View className="flex-1 items-center bg-gray-900 w-screen">
        <Pressable onPressIn={handlePressLeft} className="h-screen absolute left-0 w-1/2 flex-1 justify-end">
            <Text className="text-white bg-blue-500 p-10 text-center mb-20">Left</Text>
        </Pressable>
        <Pressable onPressIn={handlePressRight} className="h-screen absolute right-0 w-1/2 flex-1 justify-end">
            <Text className="text-white bg-blue-500 p-10 text-center mb-20">Right</Text>
        </Pressable>
      <Text className="absolute top-16 right-10 color-white" >Score: {scoreRef.current}</Text>
      <Animated.View
          className="w-full"
          style={{
            transform: [
              {
                translateY: boxTransitionValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-80, 1000], // Adjust the value to the height of your screen
                }),
              },
            ],
          }}
      >
          <View
            className={`w-full absolute ${justifyClass}`}
            style={{ top: 0, left: 0, flexDirection: 'row' }}
          >
            {renderBlackBoxes()}
          </View>
      </Animated.View>
      <Animated.View
          style={{
            transform: [
              {
                translateX: transitionValue.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: ['100%', '0%', '-100%'].map(val =>
                  parseFloat(val)
                  ), // Ensure values are parsed as floats
                }),
              },
            ],
          }}
          className="flex-1 justify-end items-center w-1/3"
      >
          <View style={{ marginBottom: 200 }}>
              <Image source={require('../assets/sprites/ships/ship-blue.gif')} />
          </View>
      </Animated.View>
    </View>
  );
}
