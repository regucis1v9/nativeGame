import React, { useRef, useState, useEffect } from 'react';
import { View, PanResponder, Animated } from 'react-native';
import 'tailwindcss/tailwind.css'; // Corrected import for tailwind.css

export default function Game() {
  const playerLocationRef = useRef('middle'); // useRef for playerLocation
  const swipeDirection = useRef(null);
  const [playerLocation, setPlayerLocation] = useState('middle'); // Player location state
  const [transitionValue] = useState(new Animated.Value(0)); // We don't need to setTransitionValue

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        if (Math.abs(dx) > 10) {
          // Minimum distance to consider it a swipe
          swipeDirection.current = dx > 0 ? 'left' : 'right';
        }
      },
      onPanResponderRelease: () => {
        const direction = swipeDirection.current; // Capture the value before resetting

        if (direction === 'right') {
          if (playerLocationRef.current === 'right') {
            console.log("edge swipe");
            return;
          }
          setPlayerLocation(prevLocation =>
            prevLocation === 'middle' ? 'right' : 'middle'
          );
        }
        if (direction === 'left') {
          if (playerLocationRef.current === 'left') {
            console.log("edge swipe");
            return;
          }
          setPlayerLocation(prevLocation =>
            prevLocation === 'middle' ? 'left' : 'middle'
          );
        }

        swipeDirection.current = null; // Reset swipe direction
      },
    })
  ).current;

  useEffect(() => {
    Animated.timing(transitionValue, {
      toValue: playerLocation === 'middle' ? 0 : playerLocation === 'left' ? -1 : 1,
      duration: 150,
      useNativeDriver: true
    }).start();
  }, [playerLocation, transitionValue]); // Added transitionValue to the dependencies


  playerLocationRef.current = playerLocation; // Update player location ref

  return (   
    <View
      {...panResponder.panHandlers}
      className="flex-1 justify-end items-center bg-gray-900"
    >
      <Animated.View
        style={{
          transform: [
            {
              translateX: transitionValue.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: ['100%', '0%', '-100%'].map(val => parseFloat(val)) // Ensure values are parsed as floats
              })
            }
          ]
        }}
        className="flex-1 justify-end items-center w-1/3"
      >
        <View style={{ marginBottom: 200 }} className='w-20 h-20 bg-blue-500'></View>
      </Animated.View>
    </View>
  );
}
