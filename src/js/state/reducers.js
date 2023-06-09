import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user'
import thunk from 'redux-thunk';

export const store = configureStore({
    reducer: {user:userReducer},middleware:[thunk]
});
