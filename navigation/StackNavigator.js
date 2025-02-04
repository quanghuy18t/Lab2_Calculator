import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BasicScreen from '../screens/BasicScreen';
import ScientificScreen from '../screens/ScientificScreen';

export default function StackNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Basic" component={BasicScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Scientific" component={ScientificScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
};