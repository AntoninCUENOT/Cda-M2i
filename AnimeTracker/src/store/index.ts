import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authSlice';
import animeReducer from './slices/animeSlice';
import libraryReducer from './slices/librarySlice';
import settingsReducer from './slices/settingsSlice';
import messagingReducer from './slices/messagingSlice';
import groupsReducer from './slices/groupsSlice';
import reviewsReducer from './slices/reviewsSlice';
import socialReducer from './slices/socialSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    anime: animeReducer,
    library: libraryReducer,
    settings: settingsReducer,
    messaging: messagingReducer,
    groups: groupsReducer,
    reviews: reviewsReducer,
    social: socialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
