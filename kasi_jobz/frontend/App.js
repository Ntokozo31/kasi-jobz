import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import JobDetailsScreen from './screens/JobDetailsScreen';
import ApplyJobScreen from './screens/ApplyJobScreen';
// Create a stack navigator for the app's navigation
const Stack = createNativeStackNavigator();

// Main App component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a0e13',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: '#0a0e13',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Kasi Jobs' }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}