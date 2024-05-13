import React, { useCallback, useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { NavigationContainer } from '@react-navigation/native';
import Landing from './Components/Landing';
import Game from './Components/Game';
import Loading from './Components/Loading';
import Leaderboard from "./Components/Leaderboard"
import Shop from "./Components/Shop"
import Payment from './Components/Payment';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'tailwindcss/tailwind.css';
import 'react-native-reanimated'
import { Linking } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const Stack = createNativeStackNavigator();
  const { handleURLCallback } = useStripe();

    useEffect(() => {
      const storage = new Storage({
        storageBackend: AsyncStorage, // for web: window.localStorage
        size: 1000,
        defaultExpires: null,
        enableCache: true,
      });
  
      storage.load({
        key: 'bonusLife',
      }).then(bonusLife => {
      }).catch(() => {
        console.log('bonusLife not set, saving default');
        storage.save({
          key: 'bonusLife',
          data: false, 
        });
      });
      storage.load({
        key: 'gameMusic',
      }).then(gameMusic => {
      }).catch(() => {
        console.log('gameMusic not set, saving default');
        storage.save({
          key: 'gameMusic',
          data: 'game1', 
        });
      });
      storage.load({
        key: 'shipColor',
      }).then(shipColor => {
      }).catch(() => {
        // Value doesn't exist, save the default value
        console.log('shipColor not set, saving default');
        storage.save({
          key: 'shipColor',
          data: 'blue', 
        });
      });
  
      // Clean up any resources when component unmounts
      return () => {
        // Clean up any resources if needed
      };
    }, []);
  const handleDeepLink = useCallback(
    async (url) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
        } else {
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener(
      'url',
      (event) => {
        handleDeepLink(event.url);
      }
    );

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

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
        <Stack.Screen
          name="Shop"
          component={Shop}
          options={{ headerShown: false }} // Hide header for Landing screen
        />
        <Stack.Screen
          name="Payment"
          component={PaymentWrapper} // Wrap Payment component with StripeProvider
          options={{ headerShown: false }} // Hide header for Landing screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
function PaymentWrapper() {
  return (
    <StripeProvider
      publishableKey="pk_test_51OZyEIESpZPSxN9af1AwxFQsX3a53PdB7cLJg2Mi1lJ9e09YJ1wfd3hlHlTCwzRNdPOa1d3Gr1aKIoX0FtF78KH200t9Z5nWro"
    >
      <Payment />
    </StripeProvider>
  );
}
