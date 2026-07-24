import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { useAppFonts } from './src/theme/fonts';
import { colors } from './src/theme/hsm';
import HomeScreen from './src/screens/hsm/HomeScreen';
import PlaceholderScreen from './src/screens/hsm/PlaceholderScreen';

const Stack = createNativeStackNavigator();

// Thème de navigation sombre pour Haitian Stars Media.
const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg },
};

// Écrans HSM à construire section par section :
// Player, StarMember, Schedule (programme), Catalog (par catégorie),
// Profile (favoris/historique), Auth, Admin.
export default function App() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Player" component={PlaceholderScreen} />
        <Stack.Screen name="StarMember" component={PlaceholderScreen} />
        <Stack.Screen name="Schedule" component={PlaceholderScreen} />
        <Stack.Screen name="Catalog" component={PlaceholderScreen} />
        <Stack.Screen name="Profile" component={PlaceholderScreen} />
        <Stack.Screen name="Auth" component={PlaceholderScreen} />
        <Stack.Screen name="Admin" component={PlaceholderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
