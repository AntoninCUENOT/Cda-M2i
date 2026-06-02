import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserAnime, Anime } from '../../types';
import { AnimeStatusType } from '../../utils/constants';
import apiClient from '../../services/apiClient';

type FilterType = AnimeStatusType | 'ALL' | 'FAVORIS';

interface BackendUserAnime {
  id_user_anime: string;
  id_anime: number;
  status: AnimeStatusType;
  episodes_watched: number;
  created_at: string;
  updated_at: string;
  anime?: {
    id_anime: number;
    title: string;
    title_english: string | null;
    image_url: string | null;
    episodes: number | null;
  };
}

function mapBackendEntry(entry: BackendUserAnime): UserAnime {
  return {
    id: entry.id_user_anime,
    animeId: entry.id_anime,
    animeTitle: entry.anime?.title_english ?? entry.anime?.title ?? `Anime #${entry.id_anime}`,
    animePoster: entry.anime?.image_url ?? '',
    status: entry.status,
    currentEpisode: entry.episodes_watched,
    totalEpisodes: entry.anime?.episodes ?? null,
    personalRating: null,
    personalNote: null,
    isFavorite: false,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  };
}

interface LibraryState {
  animes: UserAnime[];
  isLoading: boolean;
  error: string | null;
  filter: FilterType;
}

const initialState: LibraryState = {
  animes: [],
  isLoading: false,
  error: null,
  filter: 'ALL',
};

export const loadLibrary = createAsyncThunk('library/load', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<{ success: boolean; data: { data: BackendUserAnime[] } }>(
      '/users/me/animes?limit=200',
    );
    return data.data.data.map(mapBackendEntry);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Erreur chargement bibliothèque');
  }
});

export const addToLibrary = createAsyncThunk(
  'library/add',
  async ({ anime, status }: { anime: Anime; status: AnimeStatusType }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: BackendUserAnime }>(
        '/users/me/animes',
        { anime_id: anime.mal_id, status },
      );
      return {
        ...mapBackendEntry(data.data),
        animeTitle: anime.title_english ?? anime.title,
        animePoster: anime.images?.jpg?.image_url ?? '',
        totalEpisodes: anime.episodes,
      } as UserAnime;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur ajout à la bibliothèque');
    }
  },
);

export const updateLibraryAnime = createAsyncThunk(
  'library/update',
  async (
    { animeId, data }: { animeId: number; data: Partial<UserAnime> },
    { rejectWithValue },
  ) => {
    try {
      await apiClient.patch(`/users/me/animes/${animeId}`, {
        status: data.status,
        episodes_watched: data.currentEpisode,
      });
      return { animeId, data };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur mise à jour');
    }
  },
);

export const removeFromLibrary = createAsyncThunk(
  'library/remove',
  async (animeId: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/users/me/animes/${animeId}`);
      return animeId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur suppression');
    }
  },
);

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLibrary.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loadLibrary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.animes = action.payload;
      })
      .addCase(loadLibrary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addToLibrary.fulfilled, (state, action) => {
        state.animes.push(action.payload);
      })
      .addCase(addToLibrary.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateLibraryAnime.fulfilled, (state, action) => {
        const index = state.animes.findIndex((a) => a.animeId === action.payload.animeId);
        if (index !== -1) {
          state.animes[index] = { ...state.animes[index], ...action.payload.data };
        }
      })
      .addCase(removeFromLibrary.fulfilled, (state, action) => {
        state.animes = state.animes.filter((a) => a.animeId !== action.payload);
      });
  },
});

export const { setFilter } = librarySlice.actions;
export default librarySlice.reducer;

export const selectFilteredLibrary = (state: { library: LibraryState }) => {
  const { animes, filter } = state.library;
  if (filter === 'ALL') return animes;
  if (filter === 'FAVORIS') return animes.filter((a) => a.isFavorite);
  return animes.filter((a) => a.status === filter);
};

export const selectLibraryStats = (state: { library: LibraryState }) => {
  const { animes } = state.library;
  return {
    total: animes.length,
    aVoir: animes.filter((a) => a.status === 'A_VOIR').length,
    enCours: animes.filter((a) => a.status === 'EN_COURS').length,
    termine: animes.filter((a) => a.status === 'TERMINE').length,
    abandonne: animes.filter((a) => a.status === 'ABANDONNE').length,
    favoris: animes.filter((a) => a.isFavorite).length,
  };
};

export const selectDetailedStats = (state: { library: LibraryState }) => {
  const { animes } = state.library;
  const totalEpisodesWatched = animes.reduce((sum, a) => sum + (a.currentEpisode || 0), 0);
  const totalEpisodesPlanned = animes.reduce((sum, a) => sum + (a.totalEpisodes || 0), 0);
  const watchTimeMinutes = totalEpisodesWatched * 24;
  const watchTimeHours = Math.floor(watchTimeMinutes / 60);
  const watchTimeDays = Math.floor(watchTimeHours / 24);
  const ratedAnimes = animes.filter((a) => a.personalRating !== null && a.personalRating > 0);
  const averageRating =
    ratedAnimes.length > 0
      ? ratedAnimes.reduce((sum, a) => sum + (a.personalRating || 0), 0) / ratedAnimes.length
      : 0;
  const completionRate =
    animes.length > 0
      ? (animes.filter((a) => a.status === 'TERMINE').length / animes.length) * 100
      : 0;
  const monthlyAdditions: Record<string, number> = {};
  animes.forEach((a) => {
    const date = new Date(a.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyAdditions[key] = (monthlyAdditions[key] || 0) + 1;
  });
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentlyAdded = animes.filter((a) => new Date(a.createdAt) > oneWeekAgo).length;
  const recentlyUpdated = animes.filter((a) => new Date(a.updatedAt) > oneWeekAgo).length;

  return {
    total: animes.length,
    aVoir: animes.filter((a) => a.status === 'A_VOIR').length,
    enCours: animes.filter((a) => a.status === 'EN_COURS').length,
    termine: animes.filter((a) => a.status === 'TERMINE').length,
    abandonne: animes.filter((a) => a.status === 'ABANDONNE').length,
    favoris: animes.filter((a) => a.isFavorite).length,
    totalEpisodesWatched,
    totalEpisodesPlanned,
    watchTimeMinutes,
    watchTimeHours,
    watchTimeDays,
    ratedCount: ratedAnimes.length,
    averageRating: Math.round(averageRating * 10) / 10,
    completionRate: Math.round(completionRate),
    recentlyAdded,
    recentlyUpdated,
    monthlyAdditions,
  };
};

export const selectAnimeInLibrary =
  (animeId: number) => (state: { library: LibraryState }) =>
    state.library.animes.find((a) => a.animeId === animeId);
