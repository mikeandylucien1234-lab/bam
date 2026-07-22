import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { useAppFonts } from './src/theme/fonts';
import { colors } from './src/theme';
import { CartProvider } from './src/context/CartContext';
import HomeScreen from './src/screens/HomeScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import ProductScreen from './src/screens/ProductScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import AccountScreen from './src/screens/AccountScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import BamPointsScreen from './src/screens/BamPointsScreen';
import ProIntroScreen from './src/screens/ProIntroScreen';
import ProOnboardingScreen from './src/screens/ProOnboardingScreen';
import ProConfirmScreen from './src/screens/ProConfirmScreen';
import ProLoginScreen from './src/screens/ProLoginScreen';
import ProHomeScreen from './src/screens/ProHomeScreen';
import ProProductScreen from './src/screens/ProProductScreen';
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
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Catalog" component={CatalogScreen} />
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Account" component={AccountScreen} />
          <Stack.Screen name="Tracking" component={TrackingScreen} />
          <Stack.Screen name="BamPoints" component={BamPointsScreen} />
          <Stack.Screen name="ProIntro" component={ProIntroScreen} />
          <Stack.Screen name="ProOnboarding" component={ProOnboardingScreen} />
          <Stack.Screen name="ProConfirm" component={ProConfirmScreen} />
          <Stack.Screen name="ProLogin" component={ProLoginScreen} />
          <Stack.Screen name="ProHome" component={ProHomeScreen} />
          <Stack.Screen name="ProProduct" component={ProProductScreen} />
          <Stack.Screen name="Favorites" component={PlaceholderScreen} />
          <Stack.Screen name="Orders" component={PlaceholderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
