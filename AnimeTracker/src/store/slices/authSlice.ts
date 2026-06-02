import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginData, RegisterData, AuthResponse } from '../../types';
import { StorageKeys } from '../../utils/constants';
import apiClient from '../../services/apiClient';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Mappe la réponse backend vers le type User frontend
function mapBackendUser(raw: Record<string, unknown>): User {
  return {
    id: raw['id_user'] as string,
    email: raw['email'] as string,
    pseudo: raw['pseudo'] as string,
    avatar: (raw['photo'] as string | null) ?? null,
    bio: (raw['bio'] as string | null) ?? null,
    role: (raw['role'] as User['role']) ?? 'USER',
    isPublic: true,
    createdAt: raw['created_at'] as string,
    updatedAt: raw['updated_at'] as string,
  };
}

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  const token = await AsyncStorage.getItem(StorageKeys.AUTH_TOKEN);
  const userData = await AsyncStorage.getItem(StorageKeys.USER_DATA);
  if (token && userData) {
    return { token, user: JSON.parse(userData) as User };
  }
  return null;
});

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: { token: string; userId: string } }>(
        '/auth/login',
        credentials,
      );
      const token = data.data.token;

      // Récupère le profil complet
      const meRes = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(
        '/users/me',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const user = mapBackendUser(meRes.data.data);

      await AsyncStorage.setItem(StorageKeys.AUTH_TOKEN, token);
      await AsyncStorage.setItem(StorageKeys.USER_DATA, JSON.stringify(user));
      return { user, token } as AuthResponse;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: { token: string; userId: string } }>(
        '/auth/register',
        registerData,
      );
      const token = data.data.token;

      const meRes = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(
        '/users/me',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const user = mapBackendUser(meRes.data.data);

      await AsyncStorage.setItem(StorageKeys.AUTH_TOKEN, token);
      await AsyncStorage.setItem(StorageKeys.USER_DATA, JSON.stringify(user));
      return { user, token } as AuthResponse;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    await AsyncStorage.multiRemove([StorageKeys.AUTH_TOKEN, StorageKeys.USER_DATA]);
  }
});

export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.delete('/users/me');
      await AsyncStorage.multiRemove([
        StorageKeys.AUTH_TOKEN,
        StorageKeys.USER_DATA,
        StorageKeys.LIBRARY,
        StorageKeys.REVIEWS,
        StorageKeys.FOLLOWERS,
        StorageKeys.FOLLOWING,
      ]);
      return { success: true };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  },
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: { pseudo?: string; bio?: string; photo?: string }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch<{ success: boolean; data: Record<string, unknown> }>(
        '/users/me',
        profileData,
      );
      const user = mapBackendUser(data.data);
      await AsyncStorage.setItem(StorageKeys.USER_DATA, JSON.stringify(user));
      return user;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(login.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfile.pending, (state) => { state.isLoading = true; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAccount.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
