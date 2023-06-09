import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppStorage, appwriteHandler, storageKeys } from '../../helper';

const initialState = {
    data: null,
    loading: false,
    error: null,
};
export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    try {
        const resp = await appwriteHandler.account.get();
        return resp;
    } catch (e) {
        throw e;
    }
});
export const dropUser = createAsyncThunk('user/removeUser', async () => {
    try {
        const resp = await appwriteHandler.account.deleteSessions();
        return resp;
    } catch (e) {
        throw e;
    }
});
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUser: (state) => {
            return state.data;
        },
        updateUser: (state, { payload }) => {
            // AppStorage.set(storageKeys.USER, payload);
            state.data = payload;
        },
        removeUser: (state) => {
            // AppStorage.remove(storageKeys.USER);
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
            })
            .addCase(dropUser.fulfilled, (state) => {
                state.loading = false;
                state.data = null;
            });
    },
});

// Action creators are generated for each case reducer function
export const { updateUser, getUser } = userSlice.actions;

export default userSlice.reducer;
