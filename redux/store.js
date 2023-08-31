import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postsRootReducer } from "./userPostsSlice";
import { authRootReducer } from "./authSlice";

const persistPostsConfig = {
  key: "posts",
  storage: AsyncStorage,
};
const persistAuthConfig = {
  key: "auth",
  storage: AsyncStorage,
};

const persistedPostsReducer = persistReducer(
  persistPostsConfig,
  postsRootReducer
);
const persistedAuthReducer = persistReducer(persistAuthConfig, authRootReducer);

export const store = configureStore({
  reducer: {
    posts: persistedPostsReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

