import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user';
import postReducer from './slices/post';
import thunk from 'redux-thunk';

export const store = configureStore({
    reducer: { user: userReducer, post: postReducer },
    middleware: [thunk],
});
