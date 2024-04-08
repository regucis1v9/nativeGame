import React, { useRef, useState } from 'react';
import { View, PanResponder } from 'react-native';
import 'tailwindcss/tailwind.css';

export default function Game() {
  const [playerLocation, setPlayerLocation] = useState('middle');
  const swipeDirection = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        if (Math.abs(dx) > 10) {
          // Minimum distance to consider it a swipe
          swipeDirection.current = dx > 0 ? 'right' : 'left';
        }
      },
      onPanResponderRelease: () => {
        if (swipeDirection.current === 'left') {
          if (playerLocation === 'left') {
            setPlayerLocation("left")
          }
          setPlayerLocation(prevLocation => {
            return prevLocation === 'middle' ? 'right' : 'middle';
          });
        }
        if (swipeDirection.current === 'right') {
          if (playerLocation === 'right') {
            setPlayerLocation("right")
          }
          setPlayerLocation(prevLocation => {
            return prevLocation === 'middle' ? 'left' : 'middle';
          });
        }
        swipeDirection.current = null;
      },
    })
  ).current;
  
  

  let backgroundColor;
  switch (playerLocation) {
    case 'middle':
      backgroundColor = 'bg-gray-900';
      console.log(playerLocation);
      break;
    case 'left':
      backgroundColor = 'bg-red-500'; 
      console.log(playerLocation);// Change to whatever color you prefer
      break;
    case 'right':
      backgroundColor = 'bg-blue-500';
      console.log(playerLocation); // Change to whatever color you prefer
      break;
    default:
      backgroundColor = 'bg-gray-900';
  }

  return (   
    <View
      {...panResponder.panHandlers}
      className={`flex-1 items-center ${backgroundColor}`}
    >
    </View>
  );
}
