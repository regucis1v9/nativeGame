import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Landing from './Components/Landing';
import Game from './Components/Game';
import Loading from './Components/Loading';
import Leaderboard from "./Components/Leaderboard"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'tailwindcss/tailwind.css';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Loading"
          component={Loading}
          options={{ headerShown: false }} // Hide header for Loading screen
        />
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{ headerShown: false }} // Hide header for Landing screen
        />
        <Stack.Screen
          name="Game"
          component={Game}
          options={{ headerShown: false }} // Hide header for Landing screen
        />
        <Stack.Screen
          name="Leaderboard"
          component={Leaderboard}
          options={{ headerShown: false }} // Hide header for Landing screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
