import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, Image, Text, Pressable, NativeModules } from 'react-native';
import 'tailwindcss/tailwind.css';
import Background from './Background';
import sunImage from '../assets/sprites/obstacles/sunx2.png';
import saturnImage from '../assets/sprites/obstacles/saturnx2.png';
import earthImage from '../assets/sprites/obstacles/earthx2.png';
import jupiterImage from '../assets/sprites/obstacles/jupiterx2.png';

export default function Game() {
  const playerLocationRef = useRef('middle');
  const [playerLocation, setPlayerLocation] = useState('middle');
  const [transitionValue] = useState(new Animated.Value(0));
  const [boxTransitionValue] = useState(new Animated.Value(0));
  const [justifyClass, setJustifyClass] = useState('justify-between');
  const [animationStarted, setAnimationStarted] = useState(false);
  const [score, setScore] = useState(0);
  const gifWrapperPositionRef = useRef({ x: 0, y: 0 });
  const gifWrapperRef = useRef(null);
  const obstacleRef = useRef(null);
  const [freeSpace, setFreeSpace] = useState([]);
  const freeSpaceRef = useRef([]);
  const obstacleImageRef = useRef();

  useEffect(() => {
    const scoreTimer = setInterval(() => {
      setScore(prevScore => prevScore + 1);
    }, 550); 
  
    return () => clearInterval(scoreTimer); // Clean up the timer
  }, []);

  const handlePressLeft = () => {
    if (playerLocationRef.current !== 'left') {
      setPlayerLocation(prevLocation =>
        prevLocation === 'middle' ? 'left' : 'middle'
      );
    }
  };

  const handlePressRight = () => {
    if (playerLocationRef.current !== 'right') {
      setPlayerLocation(prevLocation =>
        prevLocation === 'middle' ? 'right' : 'middle'
      );
    }
  };

  useEffect(() => {
    Animated.timing(transitionValue, {
      toValue: playerLocation === 'middle' ? 0 : playerLocation === 'right' ? -1 : 1,
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
      const pairMade = Math.random() < 0.5;
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

  const allImages = [sunImage, saturnImage, earthImage, jupiterImage];

  useEffect(() => {
    updateFreeSpaces(justifyClass);
  }, [justifyClass]);
  
  const updateFreeSpaces = (justifyClass) => {
    if(justifyClass === 'justify-between'){
      setFreeSpace(['middle']);
    }
    else if(justifyClass === "justify-center"){
      setFreeSpace(['left', 'right']);
    }
    else if(justifyClass === "justify-start"){
      setFreeSpace(['right']);
    }
    else if(justifyClass === "justify-end"){
      setFreeSpace(['left']);
    }
    const selectRandomImage = () => {
      obstacleImageRef.current = allImages[Math.floor(Math.random() * allImages.length)];
    };
    selectRandomImage();
  };

const renderBlackBoxes = () => {
  console.log(obstacleImageRef.current)
    if (justifyClass === 'justify-between') {
        return (
            <>
                <View ref={obstacleRef} className="w-1/3  aspect-square z-10 flex items-center justify-center">
                    <Image className="w-full h-full" source={obstacleImageRef.current} />
                </View>
                <View className="w-1/3  aspect-square z-10 flex items-center justify-center">
                    <Image className="w-full h-full" source={obstacleImageRef.current} />
                </View>
            </>
        );
    } else if (justifyClass === 'justify-center') {
        return (
            <View ref={obstacleRef} className="w-1/3  aspect-square z-10 flex items-center justify-center">
                <Image className="w-full h-full" source={obstacleImageRef.current} />
            </View>
        );
    } else if (justifyClass === 'justify-start' || justifyClass === 'justify-end') {
        return (
            <View ref={obstacleRef} className="w-2/3 aspect-square z-10">
                <Image className="w-full h-full" source={obstacleImageRef.current} />
            </View>
        );
    } else {
        return null;
    }
};

  
  useEffect(() => {
    freeSpaceRef.current = freeSpace;
  }, [freeSpace]);

  useEffect(() => {
    let collisionOccurred = false; // Flag to track collision
    const updateWrapperPosition = () => {
      if (gifWrapperRef.current && obstacleRef.current) {
        gifWrapperRef.current.measureInWindow((x1, y1, height1, width1) => {
          const playerTop = y1;
          const playerBottom = y1 + height1;
          
          obstacleRef.current.measureInWindow((x2, y2, width2, height2) => {
            const obstacleTop = y2;
            const obstacleBottom = obstacleTop + height2;
            
            if (playerTop < obstacleBottom && playerBottom > obstacleTop) {
              if (!freeSpaceRef.current.includes(playerLocationRef.current)) {
                console.log('collision');
                collisionOccurred = true; // Set collision flag to true
              }
            }
          });
        });
      }
    };
    
    const intervalId = setInterval(updateWrapperPosition, 50); 
  
    return () => clearInterval(intervalId);
  }, []);
  
  

  return (
    <>
    <View className="flex-1 items-center w-screen z-10 absolute">
      <View className="absolute top-16 left-10 flex gap-3 flex-row z-20">
        <Image source={require('../assets/sprites/hearts/heartx2.png')}/>
        <Image source={require('../assets/sprites/hearts/heartx2.png')}/>
        <Image source={require('../assets/sprites/hearts/heartx2.png')}/>
      </View>
      <Pressable onPressIn={handlePressLeft} className="h-screen absolute left-0 w-1/2 flex-1 justify-end">
        <Text className="text-white text-center mb-20">Left</Text>
      </Pressable>
      <Pressable onPressIn={handlePressRight} className="h-screen absolute right-0 w-1/2 flex-1 justify-end">
        <Text className="text-white text-center mb-20">Right</Text>
      </Pressable>
      <Text className="absolute top-16 right-10 color-white z-20" >Score: {score}</Text>
      <Animated.View
        className="w-full"
        style={{
          transform: [
            {
              translateY: boxTransitionValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-270, 1000],
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
                ),
              }),
            },
          ],
        }}
        className="flex-1 justify-end items-center w-1/3 h-screen"
      >
        <View style={{ marginBottom: 200 }}   ref={gifWrapperRef} >
          <Image source={require('../assets/sprites/ships/ship-blue.gif')} />
        </View>
      </Animated.View>
    </View>
    <View className="absolute w-screen h-screen z-0">
        <Background/>
    </View>
    </>
  );
}
