import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { useAppFonts } from './src/theme/fonts';
import { colors } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

// Écrans identifiés dans le prototype, à remplacer un par un :
// Catalog, Product, ProIntro, ProProduct, Cart, Checkout, Account,
// Tracking, BamPoints, ProLogin, ProForm, ProConfirm
export default function App() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.cream }} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Catalog" component={PlaceholderScreen} />
        <Stack.Screen name="Product" component={PlaceholderScreen} />
        <Stack.Screen name="ProIntro" component={PlaceholderScreen} />
        <Stack.Screen name="ProProduct" component={PlaceholderScreen} />
        <Stack.Screen name="Cart" component={PlaceholderScreen} />
        <Stack.Screen name="Checkout" component={PlaceholderScreen} />
        <Stack.Screen name="Account" component={PlaceholderScreen} />
        <Stack.Screen name="Tracking" component={PlaceholderScreen} />
        <Stack.Screen name="BamPoints" component={PlaceholderScreen} />
        <Stack.Screen name="Favorites" component={PlaceholderScreen} />
        <Stack.Screen name="Orders" component={PlaceholderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
