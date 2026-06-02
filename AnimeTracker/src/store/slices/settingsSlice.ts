import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@animetracker_settings';

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  autoPlayTrailers: boolean;
  isLoading: boolean;
}

const initialState: SettingsState = {
  darkMode: false,
  notifications: true,
  autoPlayTrailers: false,
  isLoading: false,
};

export const loadSettings = createAsyncThunk('settings/load', async () => {
  const data = await AsyncStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) as Partial<SettingsState> : {};
});

export const saveSettings = createAsyncThunk(
  'settings/save',
  async (settings: Partial<SettingsState>, { getState }) => {
    const state = getState() as { settings: SettingsState };
    const updatedSettings = { ...state.settings, ...settings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    return settings;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: state => {
      state.darkMode = !state.darkMode;
    },
    toggleNotifications: state => {
      state.notifications = !state.notifications;
    },
    toggleAutoPlay: state => {
      state.autoPlayTrailers = !state.autoPlayTrailers;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadSettings.pending, state => {
        state.isLoading = true;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.darkMode !== undefined) state.darkMode = action.payload.darkMode;
        if (action.payload.notifications !== undefined) state.notifications = action.payload.notifications;
        if (action.payload.autoPlayTrailers !== undefined) state.autoPlayTrailers = action.payload.autoPlayTrailers;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        if (action.payload.darkMode !== undefined) state.darkMode = action.payload.darkMode;
        if (action.payload.notifications !== undefined) state.notifications = action.payload.notifications;
        if (action.payload.autoPlayTrailers !== undefined) state.autoPlayTrailers = action.payload.autoPlayTrailers;
      });
  },
});

export const { toggleDarkMode, toggleNotifications, toggleAutoPlay } = settingsSlice.actions;
export default settingsSlice.reducer;
