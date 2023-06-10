import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    AppStorage,
    appwriteHandler,
    envConfig,
    storageKeys,
    utils,
} from '../../helper';

const initialState = {
    data: null,
    loading: false,
    error: null,
};
export const fetchAllPosts = createAsyncThunk(
    'post/fetchAllPosts',
    async (queries) => {
        try {
            const resp = await appwriteHandler.databases.listDocuments(
                envConfig.DATABASE_ID,
                envConfig.POST_COLLECTION_ID
            );
            return resp;
        } catch (e) {
            throw e;
        }
    }
);
export const fetchOnePost = createAsyncThunk(
    'post/fetchOnePost',
    async (postId, queries) => {
        try {
            const resp = await appwriteHandler.databases.getDocument(
                envConfig.DATABASE_ID,
                envConfig.POST_COLLECTION_ID,
                postId
            );
            return resp;
        } catch (e) {
            throw e;
        }
    }
);
export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.documents.map((doc) =>
                    utils.deSerialize(doc)
                );
            })
            .addCase(fetchAllPosts.rejected, (state) => {
                state.loading = false;
            });
    },
});

// Action creators are generated for each case reducer function
// export const { } = postSlice.actions;

export default postSlice.reducer;
