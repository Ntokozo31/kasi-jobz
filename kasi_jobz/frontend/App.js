import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import JobDetailsScreen from './screens/JobDetailsScreen';
import ApplyJobScreen from './screens/ApplyJobScreen';
import SearchScreen from './screens/SearchScreen';
// Create a stack navigator for the app's navigation
const Stack = createNativeStackNavigator();

// Main App component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff', 
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderBottomColor: 'transparent',
          },
          headerTintColor: '#111827',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: '#fff', 
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen 
          name="JobDetail" 
          component={JobDetailsScreen}
          options={{ title: 'Job Details' }}
        />
        <Stack.Screen 
          name="ApplyJob" 
          component={ApplyJobScreen}
          options={{ title: 'Apply for Job' }}
        />
        <Stack.Screen 
          name="SearchScreen" 
          component={SearchScreen}
          options={{ title: 'Search Jobs' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}