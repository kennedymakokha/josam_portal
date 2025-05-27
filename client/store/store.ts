import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import { api } from './slices'; // Your RTK Query API slice

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

// Persist config
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

// Persistor
export const persistor = persistStore(store);

// Type declarations
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
