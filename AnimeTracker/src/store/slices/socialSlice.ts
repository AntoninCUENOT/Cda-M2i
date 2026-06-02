import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Follow } from '../../types';
import apiClient from '../../services/apiClient';

interface SocialState {
  followers: Follow[];
  following: Follow[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SocialState = {
  followers: [],
  following: [],
  isLoading: false,
  error: null,
};

export const loadFollowers = createAsyncThunk('social/loadFollowers', async (userId: string, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<{ success: boolean; data: Follow[] }>(`/users/${userId}/followers`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
  }
});

export const loadFollowing = createAsyncThunk('social/loadFollowing', async (userId: string, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<{ success: boolean; data: Follow[] }>(`/users/${userId}/following`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
  }
});

export const followUser = createAsyncThunk(
  'social/follow',
  async ({ targetUserId }: { targetUserId: string }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: Follow }>(`/users/${targetUserId}/follow`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const unfollowUser = createAsyncThunk(
  'social/unfollow',
  async ({ targetUserId }: { targetUserId: string }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/users/${targetUserId}/follow`);
      return targetUserId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    clearSocial: (state) => {
      state.followers = [];
      state.following = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadFollowers.pending, state => { state.isLoading = true; })
      .addCase(loadFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followers = action.payload;
      })
      .addCase(loadFollowers.rejected, state => { state.isLoading = false; })
      .addCase(loadFollowing.pending, state => { state.isLoading = true; })
      .addCase(loadFollowing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.following = action.payload;
      })
      .addCase(loadFollowing.rejected, state => { state.isLoading = false; })
      .addCase(followUser.fulfilled, (state, action) => {
        if (action.payload) state.followers.push(action.payload);
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.followers = state.followers.filter(f => f.followerId !== action.payload);
      });
  },
});

export const { clearSocial } = socialSlice.actions;
export default socialSlice.reducer;

export const selectIsFollowing = (currentUserId: string, targetUserId: string) =>
  (state: { social: SocialState }) =>
    state.social.followers.some(f => f.followerId === currentUserId && f.followingId === targetUserId);

export const selectFollowersCount = (userId: string) =>
  (state: { social: SocialState }) =>
    state.social.followers.filter(f => f.followingId === userId).length;

export const selectFollowingCount = (userId: string) =>
  (state: { social: SocialState }) =>
    state.social.following.filter(f => f.followerId === userId).length;

export const selectFollowersList = (userId: string) =>
  (state: { social: SocialState }) =>
    state.social.followers.filter(f => f.followingId === userId);

export const selectFollowingList = (userId: string) =>
  (state: { social: SocialState }) =>
    state.social.following.filter(f => f.followerId === userId);
