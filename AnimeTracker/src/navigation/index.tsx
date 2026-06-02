import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../store';
import Colors from '../utils/colors';
import { FontSize } from '../utils/constants';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import LibraryScreen from '../screens/main/LibraryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AnimeDetailScreen from '../screens/main/AnimeDetailScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import ChatScreen from '../screens/main/ChatScreen';
import NewMessageScreen from '../screens/main/NewMessageScreen';
import AnimeGroupScreen from '../screens/main/AnimeGroupScreen';
import UserProfileScreen from '../screens/main/UserProfileScreen';

import { AuthStackParamList, MainTabParamList, MainStackParamList, RootStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

type IconName = keyof typeof Ionicons.glyphMap;

const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, { active: IconName; inactive: IconName }> = {
          Home: { active: 'home', inactive: 'home-outline' },
          Search: { active: 'search', inactive: 'search-outline' },
          Library: { active: 'library', inactive: 'library-outline' },
          Messages: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
          Profile: { active: 'person', inactive: 'person-outline' },
        };
        const iconName = focused ? icons[route.name].active : icons[route.name].inactive;
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary[500],
      tabBarInactiveTintColor: Colors.gray[400],
      tabBarStyle: {
        backgroundColor: Colors.white,
        borderTopColor: Colors.border.light,
        borderTopWidth: 1,
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 10,
        height: 60 + Math.max(insets.bottom, 10),
      },
      tabBarLabelStyle: { fontSize: FontSize.xs, fontWeight: '500' },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Accueil' }} />
    <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: 'Recherche' }} />
    <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarLabel: 'Bibliothèque' }} />
    <Tab.Screen name="Messages" component={MessagesScreen} options={{ tabBarLabel: 'Messages' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
  </Tab.Navigator>
  );
};

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="MainTabs" component={MainTabNavigator} />
    <MainStack.Screen name="AnimeDetail" component={AnimeDetailScreen} />
    <MainStack.Screen name="Settings" component={SettingsScreen} />
    <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
    <MainStack.Screen name="Chat" component={ChatScreen} />
    <MainStack.Screen name="NewMessage" component={NewMessageScreen} />
    <MainStack.Screen name="AnimeGroup" component={AnimeGroupScreen} />
    <MainStack.Screen name="UserProfile" component={UserProfileScreen} />
  </MainStack.Navigator>
);

export const RootNavigator = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
