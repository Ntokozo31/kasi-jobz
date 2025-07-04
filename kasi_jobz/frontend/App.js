// Import React from 'react';
// Import View and StyleSheet from React Native.
// Import HomeScreen component from the screens directory.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import JobDetailScreen from './screens/JobDetailsScreen';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create a stack navigator for the app's navigation.
const Stack = createNativeStackNavigator();

// Main App component that renders the HomeScreen.
// This is the entry point of the application.
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// Define styles for the main container.
// The container has a flex of 1, a white background, and padding at the top
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
});
