import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user';
import postReducer from './slices/post';
import ingredientsReducer from './slices/ingredient';
import instructionReducer from './slices/instructions';
import thunk from 'redux-thunk';

export const store = configureStore({
    reducer: {
        user: userReducer,
        post: postReducer,
        ingredients: ingredientsReducer,
        instructions: instructionReducer,
    },
    middleware: [thunk],
});
