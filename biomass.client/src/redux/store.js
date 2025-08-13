import { configureStore } from '@reduxjs/toolkit';
import { userManagementApi } from './apis/userManagementApi';

export const store = configureStore({
  reducer: {
    [userManagementApi.reducerPath]: userManagementApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userManagementApi.middleware),
}); 