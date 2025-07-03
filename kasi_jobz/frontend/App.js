// Import React from 'react';
// Import View and StyleSheet from React Native.
// Import HomeScreen component from the screens directory.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';

// Main App component that renders the HomeScreen.
// This is the entry point of the application.
export default function App() {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
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
