import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// Import screens (to be created)
import HomeScreen from './screens/HomeScreen';
import GardenScreen from './screens/GardenScreen';
import PlantDetailScreen from './screens/PlantDetailScreen';
import DiagnoseScreen from './screens/DiagnoseScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthScreen from './screens/AuthScreen';

// Import components (to be created)
import TabBarIcon from './components/TabBarIcon';

// Import theme
import theme from './theme';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.text.light,
      headerTitleStyle: {
        fontWeight: theme.typography.fontWeight.bold,
      },
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Diagnose" component={DiagnoseScreen} />
  </Stack.Navigator>
);

const GardenStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.text.light,
      headerTitleStyle: {
        fontWeight: theme.typography.fontWeight.bold,
      },
    }}
  >
    <Stack.Screen name="My Garden" component={GardenScreen} />
    <Stack.Screen name="Plant Details" component={PlantDetailScreen} />
    <Stack.Screen name="Diagnose" component={DiagnoseScreen} />
  </Stack.Navigator>
);

const MarketplaceStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.text.light,
      headerTitleStyle: {
        fontWeight: theme.typography.fontWeight.bold,
      },
    }}
  >
    <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.text.light,
      headerTitleStyle: {
        fontWeight: theme.typography.fontWeight.bold,
      },
    }}
  >
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// Main tab navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.text.secondary,
      tabBarStyle: {
        backgroundColor: theme.colors.background.main,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.xs,
      },
    }}
  >
    <Tab.Screen 
      name="HomeTab" 
      component={HomeStack} 
      options={{
        headerShown: false,
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <TabBarIcon name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen 
      name="GardenTab" 
      component={GardenStack} 
      options={{
        headerShown: false,
        tabBarLabel: 'My Garden',
        tabBarIcon: ({ color, size }) => (
          <TabBarIcon name="leaf" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen 
      name="MarketplaceTab" 
      component={MarketplaceStack} 
      options={{
        headerShown: false,
        tabBarLabel: 'Shop',
        tabBarIcon: ({ color, size }) => (
          <TabBarIcon name="shopping-cart" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileStack} 
      options={{
        headerShown: false,
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <TabBarIcon name="user" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Main app component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  // Check authentication status on app load
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setIsLoggedIn(!!token);
        
        // Get user's language preference
        const userLang = await AsyncStorage.getItem('language');
        if (userLang) {
          setLanguage(userLang);
          i18n.changeLanguage(userLang);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Handle loading state
  if (isLoading) {
    // Return loading screen component here
    return null;
  }

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          {isLoggedIn ? (
            <TabNavigator />
          ) : (
            <AuthScreen setIsLoggedIn={setIsLoggedIn} />
          )}
          <StatusBar style="auto" />
        </NavigationContainer>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}