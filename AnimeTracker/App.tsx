import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';

import store, { useAppDispatch, useAppSelector } from './src/store';
import { loadUser } from './src/store/slices/authSlice';
import { loadLibrary } from './src/store/slices/librarySlice';
import { loadSettings } from './src/store/slices/settingsSlice';
import { loadReviews } from './src/store/slices/reviewsSlice';
import RootNavigator from './src/navigation';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { NotificationProvider } from './src/contexts/NotificationContext';

const AppContent = () => {
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadLibrary());
    dispatch(loadSettings());
    dispatch(loadReviews());
  }, [dispatch]);

  const navigationTheme = isDark ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background.primary,
      card: colors.card,
      text: colors.text.primary,
      border: colors.border.light,
      primary: colors.primary[500],
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background.primary,
      card: colors.card,
      text: colors.text.primary,
      border: colors.border.light,
      primary: colors.primary[500],
    },
  };

  return (
    <NotificationProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background.primary} />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </NotificationProvider>
  );
};

const AppWithTheme = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppWithTheme />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
