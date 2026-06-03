import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AdminStats, AdminUser, AdminReview, AdminGroupMessage } from '../../types';
import apiClient from '../../services/apiClient';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AdminState {
  stats: AdminStats | null;
  users: PaginatedResult<AdminUser> | null;
  reviews: PaginatedResult<AdminReview> | null;
  groupMessages: PaginatedResult<AdminGroupMessage> | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  users: null,
  reviews: null,
  groupMessages: null,
  isLoading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<{ success: boolean; data: AdminStats }>('/admin/stats');
      return data.data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({ page = 1, search }: { page?: number; search?: string }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.append('search', search);
      const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<AdminUser> }>(
        `/admin/users?${params.toString()}`,
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const changeUserRole = createAsyncThunk(
  'admin/changeRole',
  async ({ userId, role }: { userId: string; role: string }, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/role`, { role });
      return { userId, role };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const suspendUser = createAsyncThunk(
  'admin/suspendUser',
  async ({ userId, days }: { userId: string; days: number }, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/suspend`, { days });
      return userId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const unsuspendUser = createAsyncThunk(
  'admin/unsuspendUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/unsuspend`);
      return userId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const deleteAdminUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const fetchAdminReviews = createAsyncThunk(
  'admin/fetchReviews',
  async (page = 1, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<AdminReview> }>(
        `/admin/reviews?page=${page}&limit=20`,
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const deleteAdminReview = createAsyncThunk(
  'admin/deleteReview',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/reviews/${reviewId}`);
      return reviewId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const changeReviewVisibility = createAsyncThunk(
  'admin/changeReviewVisibility',
  async (
    { reviewId, visibility }: { reviewId: string; visibility: 'PUBLIC' | 'PRIVE' },
    { rejectWithValue },
  ) => {
    try {
      await apiClient.patch(`/admin/reviews/${reviewId}/visibility`, { visibility });
      return { reviewId, visibility };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const fetchAdminGroupMessages = createAsyncThunk(
  'admin/fetchGroupMessages',
  async (page = 1, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: PaginatedResult<AdminGroupMessage>;
      }>(`/admin/group-messages?page=${page}&limit=20`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const deleteAdminGroupMessage = createAsyncThunk(
  'admin/deleteGroupMessage',
  async (messageId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/group-messages/${messageId}`);
      return messageId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAdminStats.pending, state => { state.isLoading = true; state.error = null; })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdminUsers.pending, state => { state.isLoading = true; })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, state => { state.isLoading = false; })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        if (state.users) {
          const user = state.users.data.find(u => u.id_user === action.payload.userId);
          if (user) user.role = action.payload.role as AdminUser['role'];
        }
      })
      .addCase(suspendUser.fulfilled, (state, action) => {
        if (state.users) {
          const user = state.users.data.find(u => u.id_user === action.payload);
          if (user) user.is_suspended = true;
        }
      })
      .addCase(unsuspendUser.fulfilled, (state, action) => {
        if (state.users) {
          const user = state.users.data.find(u => u.id_user === action.payload);
          if (user) { user.is_suspended = false; user.suspension_end_date = null; }
        }
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        if (state.users) {
          state.users.data = state.users.data.filter(u => u.id_user !== action.payload);
          state.users.total -= 1;
        }
      })
      .addCase(fetchAdminReviews.pending, state => { state.isLoading = true; })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchAdminReviews.rejected, state => { state.isLoading = false; })
      .addCase(deleteAdminReview.fulfilled, (state, action) => {
        if (state.reviews) {
          state.reviews.data = state.reviews.data.filter(r => r.id_review !== action.payload);
          state.reviews.total -= 1;
        }
      })
      .addCase(changeReviewVisibility.fulfilled, (state, action) => {
        if (state.reviews) {
          const review = state.reviews.data.find(r => r.id_review === action.payload.reviewId);
          if (review) review.visibility = action.payload.visibility;
        }
      })
      .addCase(fetchAdminGroupMessages.pending, state => { state.isLoading = true; })
      .addCase(fetchAdminGroupMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groupMessages = action.payload;
      })
      .addCase(fetchAdminGroupMessages.rejected, state => { state.isLoading = false; })
      .addCase(deleteAdminGroupMessage.fulfilled, (state, action) => {
        if (state.groupMessages) {
          state.groupMessages.data = state.groupMessages.data.filter(
            m => m.id_group_message !== action.payload,
          );
          state.groupMessages.total -= 1;
        }
      });
  },
});

export default adminSlice.reducer;
