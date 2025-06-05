import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * TabBarIcon Component
 * 
 * A reusable component for tab bar icons in the bottom navigation.
 * Uses Ionicons from Expo vector icons.
 * 
 * @param {string} name - The name of the icon from Ionicons
 * @param {string} color - The color of the icon
 * @param {number} size - The size of the icon
 */
const TabBarIcon = ({ name, color, size }) => {
  // Map our simplified icon names to Ionicons names
  const iconMap = {
    home: 'home',
    leaf: 'leaf',
    'shopping-cart': 'cart',
    user: 'person',
    camera: 'camera',
    settings: 'settings',
    heart: 'heart',
    search: 'search',
    add: 'add-circle',
    water: 'water',
    calendar: 'calendar',
    location: 'location',
    notification: 'notifications',
    info: 'information-circle',
  };

  // Get the Ionicons name or use the provided name as fallback
  const ionIconName = iconMap[name] || name;

  return (
    <View style={styles.container}>
      <Ionicons name={ionIconName} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabBarIcon;