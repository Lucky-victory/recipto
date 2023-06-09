import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUser: (state) => {
            return state.value;
        },
        updateUser: (state, { payload }) => {
            state.value = payload;
        },
        removeUser: (state) => {
            state.value = null;
        },
    },
});

// Action creators are generated for each case reducer function
export const { updateUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
