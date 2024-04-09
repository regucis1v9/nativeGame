import React, { useRef, useState, useEffect } from 'react';
import { View, PanResponder, Animated, Image } from 'react-native';
import 'tailwindcss/tailwind.css'; // Corrected import for tailwind.css

export default function Game() {
  const playerLocationRef = useRef('middle'); // useRef for playerLocation
  const swipeDirection = useRef(null);
  const [playerLocation, setPlayerLocation] = useState('middle'); // Player location state
  const [transitionValue] = useState(new Animated.Value(0)); // We don't need to setTransitionValue
  const [boxTransitionValue] = useState(new Animated.Value(0)); // Added for box movement
  const [justifyClass, setJustifyClass] = useState('justify-between'); // State for random justify class
  const [animationStarted, setAnimationStarted] = useState(false); // State to track if animation has started

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
            return;
          }
          setPlayerLocation(prevLocation =>
            prevLocation === 'middle' ? 'right' : 'middle'
          );
        }
        if (direction === 'left') {
          if (playerLocationRef.current === 'left') {
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
      }, 1000); // Delay for 2 seconds before starting the animation
    } else {
      const animateBlock = () => {
        setJustifyClass(getRandomJustifyClass()); 
        Animated.timing(boxTransitionValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => {
          boxTransitionValue.setValue(0);
          animateBlock(); // Start the animation again once it completes
        });
      };
    
      animateBlock(); // Start the animation initially
    
      return () => {
        // Clean up function to stop the animation when the component unmounts
        boxTransitionValue.stopAnimation();
      };
    }
  }, [animationStarted]); // Run effect when animationStarted changes

  const renderBlackBoxes = () => {
    if (justifyClass === 'justify-between') {
      return (
        <>
          <View className="w-1/3 h-20 bg-black"></View>
          <View className="w-1/3 h-20 bg-black"></View>
        </>
      );
    } else if (justifyClass === 'justify-center') {
      return <View className="w-1/3 h-20 bg-black"></View>;
    } else if (justifyClass === 'justify-start' || justifyClass === 'justify-end') {
      const pairMade = justifyClass === 'justify-start' ? Math.random() < 0.5 : Math.random() >= 0.5;
      if (pairMade) {
        return (
          <>
            <View className="w-1/3 h-20 bg-black"></View>
            <View className="w-1/3 h-20 bg-black"></View>
          </>
        );
      } else {
        return <View className="w-1/3 h-20 bg-black"></View>;
      }
    } else {
      return null;
    }
  };
  return (
    <View
      {...panResponder.panHandlers}
      className="flex-1 items-center bg-gray-900 w-screen"
    >
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
