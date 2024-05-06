import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, Image, Text, Pressable, NativeModules } from 'react-native';
import 'tailwindcss/tailwind.css';
import Background from './Background';
import sunImage from '../assets/sprites/obstacles/sunx2.png';
import saturnImage from '../assets/sprites/obstacles/saturnx2.png';
import earthImage from '../assets/sprites/obstacles/earthx2.png';
import jupiterImage from '../assets/sprites/obstacles/jupiterx2.png';
import asteroidImage from "../assets/sprites/obstacles/asteroidx2.png"
import blackImage from "../assets/sprites/obstacles/blackHole.png"
import heartFullImage from '../assets/sprites/hearts/heartx2.png';
import heartEmptyImage from '../assets/sprites/hearts/heart_empty2x2.png';
import homeButton from "../assets/sprites/buttons/homeButton.png";
import homeButtonx5 from "../assets/sprites/buttons/homeButtonx5.png";
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';


export default function Game() {

  const navigation = useNavigation();
  const [isGameOver, setIsGameOver] = useState(false);
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
  const healthRef = useRef(3); // Use useRef for health
  const collisionDetectedRef = useRef(false); // Ref to track if collision has been detected
  const scoreTimerRef = useRef(null); // Declare scoreTimerRef using useRef

  async function loadFont() {
    try {
      await Font.loadAsync({
        'PixelifySans': require('../assets/fonts/PixelifySans-VariableFont_wght.ttf'),
      });
    } catch (error) {
      console.error('Error loading font:', error);
    }
  }
  

  useEffect(() => { 
      loadFont();
  }, []);

  useEffect(() => {
    (async () => {
        await loadFont();
    })();
  }, []);

  useEffect(() => {
    scoreTimerRef.current = setInterval(() => {
      setScore(prevScore => (isGameOver ? prevScore : prevScore + 1)); // Stop score increment when game is over
    }, 550);
  
    return () => clearInterval(scoreTimerRef.current); // Clean up the timer
  }, [isGameOver]);
  
  const handlePause = () => {
    navigation.navigate('Landing'); // Navigate back to the 'Landing' screen
    clearInterval(scoreTimerRef.current);
    boxTransitionValue.stopAnimation();
  };
  const handleTryAgain = () => {
    setScore(0); // Reset score to zero
    setIsGameOver(false); 
    healthRef.current = 3;
    playerLocationRef.current = "middle"
    setPlayerLocation('middle')
  };
  const handlePressLeft = () => {
    if(isGameOver){
      return
    }
    if (playerLocationRef.current !== 'left') {
      setPlayerLocation(prevLocation =>
        prevLocation === 'middle' ? 'left' : 'middle'
      );
    }
  };
  const handlePressRight = () => {
    if(isGameOver){
      return
    }
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
    const randomNum = Math.random();
  
    // Adjusted probabilities
    if (randomNum < 0.2) {
      return 'justify-start';
    } else if (randomNum < 0.4) {
      return 'justify-end';
    } else {
      const pairMade = Math.random() < 0.5;
      if (pairMade) {
        return 'justify-between';
      } else {
        return 'justify-center';
      }
    }
  };

  useEffect(() => {
    if(isGameOver){
      return;
    }
    if (!animationStarted) {
      setTimeout(() => {
        setAnimationStarted(true);
      }, 1000);
    } else {
      const animateBlock = () => {
        setJustifyClass(getRandomJustifyClass());
        Animated.timing(boxTransitionValue, {
          toValue: 1,
          duration: 1800,
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
      const randomNum = Math.random();
    
      if (randomNum < 0.1) {
        obstacleImageRef.current = blackImage; // 10% chance for Black Hole
      } else if (randomNum < 0.2) {
        obstacleImageRef.current = earthImage; // 10% chance for Earth
      } else if (randomNum < 0.4) {
        obstacleImageRef.current = sunImage; // 20% chance for Sun
      } else {
        // The remaining 60% is split between Saturn, Jupiter, and Asteroid
        const remainingRandom = Math.random() * 0.6;
    
        if (remainingRandom < 0.25) {
          obstacleImageRef.current = saturnImage; // 25% chance for Saturn
        } else if (remainingRandom < 0.5) {
          obstacleImageRef.current = jupiterImage; // 25% chance for Jupiter
        } else {
          obstacleImageRef.current = asteroidImage; // 50% chance for Asteroid
        }
      }
    };
    
    

    
    selectRandomImage();
  };

const renderBlackBoxes = () => {
  collisionDetectedRef.current = false;
    if (justifyClass === 'justify-between') {
        return (
            <>
                <View ref={obstacleRef} className="w-1/3 h-28 z-10 flex items-center justify-center ">
                    <Image className="object-cover object-center" source={obstacleImageRef.current} />
                </View>
                <View className="w-1/3 h-28 z-10 flex items-center justify-center">
                    <Image className="object-cover object-center" source={obstacleImageRef.current} />
                </View>
            </>
        );
    } else if (justifyClass === 'justify-center') {
        return (
            <View ref={obstacleRef} className="w-1/3 h-28  z-10 flex items-center justify-center ">
                <Image className="object-cover object-center" source={obstacleImageRef.current} />
            </View>
        );
    } else if (justifyClass === 'justify-start' || justifyClass === 'justify-end') {
        return (
            <View ref={obstacleRef} className="w-2/3 z-10 flex items-center justify-center">
                <Image className="object-cover object-center scale-150 " source={obstacleImageRef.current} />
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
  const updateWrapperPosition = () => {
    if(isGameOver){
      return;
    }
    if (gifWrapperRef.current && obstacleRef.current && !isGameOver) {
      gifWrapperRef.current.measureInWindow((x1, y1, height1, width1) => {
        const playerTop = y1;
        const playerBottom = y1 + height1;
        
        obstacleRef.current.measureInWindow((x2, y2, width2, height2) => {
          const obstacleTop = y2;
          const obstacleBottom = obstacleTop + height2;
          
          if (
            playerTop < obstacleBottom &&
            playerBottom > obstacleTop &&
            !collisionDetectedRef.current // Ensure collision is not already detected
          ) {
            if (!freeSpaceRef.current.includes(playerLocationRef.current)) {
              collisionDetectedRef.current = true; 
              let damage = 0;
              if (obstacleImageRef.current === earthImage) {
                damage = 1; // Earth: heal 1 health point
              } else if (obstacleImageRef.current === sunImage) {
                damage = -3; // Sun: deduct 3 health points
              } else if (obstacleImageRef.current === asteroidImage) {
                damage = -1; // Asteroid: deduct 1 health point
              } else if (obstacleImageRef.current === saturnImage || obstacleImageRef.current === jupiterImage) {
                damage = -2; // Saturn or Jupiter: deduct 2 health points
              } else if (obstacleImageRef.current === blackImage) {
                healthRef.current = 0; // Black Hole: instantly set health to 0
              }
  
              healthRef.current = Math.min(Math.max(healthRef.current + damage, 0), 3); // Cap between 0 and 3
              console.log(healthRef.current);
              if (healthRef.current === 0) { // Check if health reaches zero
                setIsGameOver(true)
              }
            }
          } else {
            collisionDetectedRef.current = false; // Reset the collision detection flag if no collision detected
          }
        });
      });
    }
  };
  
  
  const intervalId = setInterval(updateWrapperPosition, 75); 

  return () => clearInterval(intervalId);
}, [isGameOver]);


  const hearts = Array.from({ length: 3 }, (_, index) => {
    if (index < healthRef.current) {
      return <Image key={index} source={heartFullImage} />;
    } else {
      return <Image key={index} source={heartEmptyImage} />;
    }
  });
  return (
    <>
    <View className="flex-1 items-center w-screen z-10 absolute">
      <Pressable onPressIn={handlePause} className="z-30">
        <View className="absolute top-16  flex gap-3 flex-row z-20">
          <Image className="scale-150" source={homeButton}/>
        </View>
      </Pressable>
      <View className="absolute top-16 left-10 flex gap-3 flex-row z-20">
        {hearts}
      </View>
      <Pressable onPressIn={handlePressLeft} className="h-screen absolute left-0 w-1/2 flex-1 justify-end z-20">
        <Text className="text-white text-center mb-20">Left</Text>
      </Pressable>
      <Pressable onPressIn={handlePressRight} className="h-screen absolute right-0 w-1/2 flex-1 justify-end z-20">
        <Text className="text-white text-center mb-20">Right</Text>
      </Pressable>
      <Text style={{ fontFamily: "PixelifySans" }} className="absolute top-16 right-10 color-white z-20" >Score: {score}</Text>
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
        {!isGameOver && renderBlackBoxes()}
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
    { isGameOver && 
    <View className="absolute h-screen w-screen bg-black z-50 flex-1">
      <View className="h-full w-full flex-1 items-center justify-center z-50">
        <View className="bg-white h-3/5 w-2/3 flex  flex-col">
          <Text style={{ fontFamily: "PixelifySans" }} className="text-black text-4xl w-full text-center mt-12"> Game Over</Text>
          <Text style={{ fontFamily: "PixelifySans" }} className="text-black text-3xl w-full text-center mt-16"> Your Score</Text>
          <Text style={{ fontFamily: "PixelifySans" }} className="text-black text-2xl w-full text-center mt-3">{score}</Text>
          <Pressable onPressIn={handleTryAgain}>
            <Text style={{ fontFamily: "PixelifySans" }} className="text-black text-3xl w-full text-center mt-32">Try Again</Text>
          </Pressable>
          <View className="mt-3 w-full flex items-center justify-center">
            <Pressable onPressIn={handlePause}>
              <Image source={homeButtonx5} className="scale-75"/>
            </Pressable>
          </View>
        </View>
      </View>
      <View className="absolute z-0">
        <Background/>
      </View>
    </View>
    }
    </>
  );
}
