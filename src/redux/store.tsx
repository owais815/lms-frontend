import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authSlice from "./Slices/AuthSlice";
import changeEventSlice from "./Slices/changeEvent";


// Configuration object for redux-persist
const persistConfig = {
  key: "root",
  storage,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, authSlice);

const store = configureStore({
  reducer: { auth: persistedReducer,changeEvent: changeEventSlice },
});

// Create a persistor
export const persistor = persistStore(store);
export default store;
