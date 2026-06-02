import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Review } from '../../types';
import apiClient from '../../services/apiClient';

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  isLoading: false,
  error: null,
};

interface BackendReview {
  id_review: string;
  id_user: string;
  id_anime: number;
  rating: number;
  comment: string | null;
  visibility: 'PUBLIC' | 'PRIVE';
  likes_count: number;
  created_at: string;
  updated_at: string;
  author?: { id_user: string; pseudo: string; photo: number | string | null };
}

function mapReview(
  r: BackendReview,
  supplement?: {
    userPseudo?: string;
    userAvatar?: number | string | null;
    animeTitle?: string;
    animePoster?: string;
  },
): Review {
  return {
    id: r.id_review,
    userId: r.id_user,
    userPseudo: r.author?.pseudo ?? supplement?.userPseudo ?? '',
    userAvatar: r.author?.photo ?? supplement?.userAvatar ?? null,
    animeId: r.id_anime,
    animeTitle: supplement?.animeTitle ?? '',
    animePoster: supplement?.animePoster ?? '',
    rating: Number(r.rating),
    content: r.comment ?? '',
    isPublic: r.visibility === 'PUBLIC',
    likesCount: r.likes_count ?? 0,
    likedBy: [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export const loadReviewsForAnime = createAsyncThunk(
  'reviews/loadForAnime',
  async (animeId: number, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: { data: BackendReview[]; total: number; page: number; totalPages: number };
      }>(`/animes/${animeId}/reviews`);
      return { animeId, reviews: data.data.data.map(r => mapReview(r)) };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const loadMyReview = createAsyncThunk(
  'reviews/loadMyReview',
  async (animeId: number, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<{ success: boolean; data: BackendReview | null }>(
        `/animes/${animeId}/my-review`,
      );
      if (!data.data) return null;
      return mapReview(data.data);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

// Kept for any residual import — no-op
export const loadReviews = createAsyncThunk('reviews/load', async () => [] as Review[]);

export const createReview = createAsyncThunk(
  'reviews/create',
  async (
    reviewData: {
      userId: string;
      userPseudo: string;
      userAvatar: number | string | null;
      animeId: number;
      animeTitle: string;
      animePoster: string;
      rating: number;
      content: string;
      isPublic: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: BackendReview }>(
        `/animes/${reviewData.animeId}/reviews`,
        {
          rating: reviewData.rating,
          comment: reviewData.content,
          visibility: reviewData.isPublic ? 'PUBLIC' : 'PRIVE',
        },
      );
      return mapReview(data.data, {
        userPseudo: reviewData.userPseudo,
        userAvatar: reviewData.userAvatar,
        animeTitle: reviewData.animeTitle,
        animePoster: reviewData.animePoster,
      });
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const updateReview = createAsyncThunk(
  'reviews/update',
  async (
    { reviewId, data }: { reviewId: string; data: Partial<Review> },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as { reviews: ReviewsState };
      const existing = state.reviews.reviews.find(r => r.id === reviewId);
      if (!existing) throw new Error('Review non trouvée');

      const { data: response } = await apiClient.post<{ success: boolean; data: BackendReview }>(
        `/animes/${existing.animeId}/reviews`,
        {
          rating: data.rating ?? existing.rating,
          comment: data.content ?? existing.content,
          visibility: (data.isPublic ?? existing.isPublic) ? 'PUBLIC' : 'PRIVE',
        },
      );
      return {
        reviewId,
        updated: mapReview(response.data, {
          userPseudo: existing.userPseudo,
          userAvatar: existing.userAvatar,
          animeTitle: existing.animeTitle,
          animePoster: existing.animePoster,
        }),
      };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/users/me/reviews/${reviewId}`);
      return reviewId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const toggleLikeReview = createAsyncThunk(
  'reviews/toggleLike',
  async (
    { reviewId, userId }: { reviewId: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: { liked: boolean } }>(
        `/users/me/reviews/${reviewId}/like`,
      );
      return { reviewId, userId, liked: data.data.liked };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadReviewsForAnime.pending, state => { state.isLoading = true; })
      .addCase(loadReviewsForAnime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = [
          ...state.reviews.filter(r => r.animeId !== action.payload.animeId),
          ...action.payload.reviews,
        ];
      })
      .addCase(loadReviewsForAnime.rejected, state => { state.isLoading = false; })
      .addCase(loadMyReview.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.reviews.findIndex(
          r => r.userId === action.payload!.userId && r.animeId === action.payload!.animeId,
        );
        if (idx !== -1) {
          state.reviews[idx] = action.payload;
        } else {
          state.reviews.push(action.payload);
        }
      })
      .addCase(loadReviews.fulfilled, () => { /* no-op */ })
      .addCase(createReview.fulfilled, (state, action) => {
        const idx = state.reviews.findIndex(
          r => r.userId === action.payload.userId && r.animeId === action.payload.animeId,
        );
        if (idx !== -1) {
          state.reviews[idx] = action.payload;
        } else {
          state.reviews.push(action.payload);
        }
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r.id === action.payload.reviewId);
        if (index !== -1) {
          state.reviews[index] = action.payload.updated;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
      })
      .addCase(toggleLikeReview.fulfilled, (state, action) => {
        const { reviewId, userId, liked } = action.payload;
        const review = state.reviews.find(r => r.id === reviewId);
        if (review) {
          if (liked) {
            if (!review.likedBy.includes(userId)) {
              review.likedBy.push(userId);
              review.likesCount += 1;
            }
          } else {
            review.likedBy = review.likedBy.filter(id => id !== userId);
            review.likesCount = Math.max(0, review.likesCount - 1);
          }
        }
      });
  },
});

export default reviewsSlice.reducer;

export const selectUserReviewForAnime = (userId: string, animeId: number) =>
  (state: { reviews: ReviewsState }) =>
    state.reviews.reviews.find(r => r.userId === userId && r.animeId === animeId);

export const selectPublicReviewsForAnime = (animeId: number) =>
  (state: { reviews: ReviewsState }) =>
    state.reviews.reviews
      .filter(r => r.animeId === animeId && r.isPublic)
      .sort((a, b) => b.likesCount - a.likesCount);

export const selectUserReviews = (userId: string) =>
  (state: { reviews: ReviewsState }) =>
    state.reviews.reviews.filter(r => r.userId === userId);

export const selectPublicReviewsByUser = (userId: string) =>
  (state: { reviews: ReviewsState }) =>
    state.reviews.reviews.filter(r => r.userId === userId && r.isPublic);
