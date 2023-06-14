import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    AppStorage,
    appwriteHandler,
    envConfig,
    storageKeys,
    utils,
} from '../../helper';
import { Query, Permission, Role } from 'appwrite';
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
export const likePost = createAsyncThunk(
    'post/likePost',
    async ({ postId, data }, { dispatch }) => {
        try {
            dispatch(likePostR({ data, userId }));

            const resp = await appwriteHandler.databases.updateDocument(
                envConfig.DATABASE_ID,
                envConfig.POST_COLLECTION_ID,
                postId,
                data,
                [Permission.update(Role.users())]
            );
            return resp;
        } catch (e) {
            throw e;
        }
    }
);
export const dislikePost = createAsyncThunk(
    'post/dislikePost',
    async ({ postId, data }, { dispatch }) => {
        try {
            dispatch(dislikePostR({ data, userId }));
            const resp = await appwriteHandler.databases.updateDocument(
                envConfig.DATABASE_ID,
                envConfig.POST_COLLECTION_ID,
                postId,
                data,
                [Permission.update(Role.users())]
            );
            return resp;
        } catch (e) {
            throw e;
        }
    }
);
export const fetchOnePost = createAsyncThunk(
    'post/fetchOnePost',
    async (postId) => {
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
        likePostR(state, { payload }) {
            console.log('like');
            const doc = state.data.find(
                (_doc) => _doc.id === payload?.data?.id
            );
            if (doc) {
                doc.liked_by.push(payload?.userId);
            }
            state.data = state.data.map((_doc) => {
                return _doc.id === doc.id ? doc : _doc;
            });
        },
        dislikePostR(state, { payload }) {
            console.log('dislike');
            const doc = state.data.find(
                (_doc) => _doc.id === payload?.data?.id
            );
            if (doc) {
                doc.liked_by = doc.liked_by.filter(
                    (id) => id !== payload?.userId
                );
            }
            state.data = state.data.map((_doc) => {
                return _doc.id === doc.id ? doc : _doc;
            });
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
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const doc = utils.deSerialize(action.payload);

                state.data = state.data.map((_doc) => {
                    return _doc.id === doc.id ? doc : _doc;
                });
            })
            .addCase(dislikePost.fulfilled, (state, action) => {
                const doc = utils.deSerialize(action.payload);

                state.data = state.data.map((_doc) => {
                    return _doc.id === doc.id ? doc : _doc;
                });
            });
    },
});

// Action creators are generated for each case reducer function
export const { setOnePost, dislikePostR, likePostR } = postSlice.actions;

export default postSlice.reducer;
