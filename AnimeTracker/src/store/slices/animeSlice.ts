import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Anime } from '../../types';
import { jikanApi, SearchFilters } from '../../services/jikanApi';

interface AnimeState {
  seasonAnimes: Anime[];
  seasonLoading: boolean;
  seasonError: string | null;
  topAnimes: Anime[];
  topLoading: boolean;
  topError: string | null;
  searchResults: Anime[];
  searchLoading: boolean;
  searchError: string | null;
  searchQuery: string;
  searchFilters: SearchFilters;
  genres: { mal_id: number; name: string }[];
  genresLoading: boolean;
  selectedAnime: Anime | null;
  selectedLoading: boolean;
  selectedError: string | null;
  hasMorePages: boolean;
}

const initialState: AnimeState = {
  seasonAnimes: [],
  seasonLoading: false,
  seasonError: null,
  topAnimes: [],
  topLoading: false,
  topError: null,
  searchResults: [],
  searchLoading: false,
  searchError: null,
  searchQuery: '',
  searchFilters: {},
  genres: [],
  genresLoading: false,
  selectedAnime: null,
  selectedLoading: false,
  selectedError: null,
  hasMorePages: true,
};

export const fetchSeasonAnimes = createAsyncThunk(
  'anime/fetchSeason',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await jikanApi.getCurrentSeasonAnime(page);
      return { data: response.data, hasMore: response.pagination?.has_next_page ?? false, page };
    } catch {
      return rejectWithValue('Impossible de charger les animes de la saison');
    }
  }
);

export const fetchTopAnimes = createAsyncThunk(
  'anime/fetchTop',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await jikanApi.getTopAnime(page);
      return { data: response.data, hasMore: response.pagination?.has_next_page ?? false, page };
    } catch {
      return rejectWithValue('Impossible de charger les top animes');
    }
  }
);

export const searchAnimes = createAsyncThunk(
  'anime/search',
  async ({ query, page = 1, filters }: { query: string; page?: number; filters?: SearchFilters }, { rejectWithValue }) => {
    try {
      const response = await jikanApi.searchAnime(query, page, filters);
      return { data: response.data, hasMore: response.pagination?.has_next_page ?? false, page, query };
    } catch {
      return rejectWithValue('Erreur lors de la recherche');
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'anime/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      return await jikanApi.getGenres();
    } catch {
      return rejectWithValue('Impossible de charger les genres');
    }
  }
);

export const fetchAnimeDetail = createAsyncThunk(
  'anime/fetchDetail',
  async (animeId: number, { rejectWithValue }) => {
    try {
      return await jikanApi.getAnimeById(animeId);
    } catch {
      return rejectWithValue('Impossible de charger les détails');
    }
  }
);

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    clearSearch: state => { state.searchResults = []; state.searchQuery = ''; },
    clearSelectedAnime: state => { state.selectedAnime = null; },
    setSearchFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.searchFilters = action.payload;
    },
    clearSearchFilters: state => { state.searchFilters = {}; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSeasonAnimes.pending, state => { state.seasonLoading = true; })
      .addCase(fetchSeasonAnimes.fulfilled, (state, action) => {
        state.seasonLoading = false;
        state.seasonAnimes = action.payload.page === 1 ? action.payload.data : [...state.seasonAnimes, ...action.payload.data];
        state.hasMorePages = action.payload.hasMore;
      })
      .addCase(fetchSeasonAnimes.rejected, (state, action) => {
        state.seasonLoading = false;
        state.seasonError = action.payload as string;
      })
      .addCase(fetchTopAnimes.pending, state => { state.topLoading = true; })
      .addCase(fetchTopAnimes.fulfilled, (state, action) => {
        state.topLoading = false;
        state.topAnimes = action.payload.page === 1 ? action.payload.data : [...state.topAnimes, ...action.payload.data];
      })
      .addCase(fetchTopAnimes.rejected, (state, action) => {
        state.topLoading = false;
        state.topError = action.payload as string;
      })
      .addCase(searchAnimes.pending, state => { state.searchLoading = true; })
      .addCase(searchAnimes.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.page === 1 ? action.payload.data : [...state.searchResults, ...action.payload.data];
        state.searchQuery = action.payload.query;
      })
      .addCase(searchAnimes.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload as string;
      })
      .addCase(fetchGenres.pending, state => { state.genresLoading = true; })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genresLoading = false;
        state.genres = action.payload;
      })
      .addCase(fetchAnimeDetail.pending, state => { state.selectedLoading = true; })
      .addCase(fetchAnimeDetail.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedAnime = action.payload;
      })
      .addCase(fetchAnimeDetail.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload as string;
      });
  },
});

export const { clearSearch, clearSelectedAnime, setSearchFilters, clearSearchFilters } = animeSlice.actions;
export default animeSlice.reducer;
