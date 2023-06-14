import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    AppStorage,
    appwriteHandler,
    envConfig,
    storageKeys,
    utils,
} from '../../helper';
import { Query } from 'appwrite';
const initialState = {
    data: [],
    loading: false,
    error: null,
    one: {
        loading: false,
        data: {},
    },
};
export const fetchAllPosts = createAsyncThunk(
    'post/fetchAllPosts',
    async (queries) => {
        try {
            const resp = await appwriteHandler.databases.listDocuments(
                envConfig.DATABASE_ID,
                envConfig.POST_COLLECTION_ID,
                [Query.orderDesc('created_at')]
            );
            return resp;
        } catch (e) {
            throw e;
        }
    }
);
export const fetchOnePost = createAsyncThunk(
    'post/fetchOnePost',
    async (postId, queries = []) => {
        try {
            const resp = await appwriteHandler.databases.getDocument(
                envConfig.DATABASE_ID,
                envConfig.POST_COLLECTION_ID,
                postId,
                [Query.equal('id', postId)]
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
    reducers: {
        setOnePost(state, { payload }) {
            state.one.data = payload;
        },
    },
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
            })
            .addCase(fetchOnePost.pending, (state) => {
                state.one.loading = true;
            })
            .addCase(fetchOnePost.fulfilled, (state, action) => {
                state.one.loading = false;
                state.one.data = utils.deSerialize(action.payload);
            })
            .addCase(fetchOnePost.rejected, (state) => {
                state.one.loading = false;
            });
    },
});

// Action creators are generated for each case reducer function
export const { setOnePost} = postSlice.actions;

export default postSlice.reducer;
