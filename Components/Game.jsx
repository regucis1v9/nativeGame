import React, { useRef, useState } from 'react';
import { View, PanResponder } from 'react-native';
import 'tailwindcss/tailwind.css';

export default function Game() {
  const playerLocationRef = useRef('middle'); // useRef for playerLocation
  const swipeDirection = useRef(null);

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

  const [playerLocation, setPlayerLocation] = useState('middle'); // Player location state

  let backgroundColor;
  switch (playerLocation) {
    case 'middle':
      backgroundColor = 'bg-gray-900';
      break;
    case 'left':
      backgroundColor = 'bg-red-500'; 
      break;
    case 'right':
      backgroundColor = 'bg-blue-500';
      break;
    default:
      backgroundColor = 'bg-gray-900';
  }

  playerLocationRef.current = playerLocation; // Update player location ref

  return (   
    <View
      {...panResponder.panHandlers}
      className={`flex-1 items-center ${backgroundColor}`}
    >
    </View>
  );
}
