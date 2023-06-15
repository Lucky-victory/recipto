import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { appwriteHandler, envConfig, utils } from '../../helper';
import { Query, Permission, Role } from 'appwrite';
const initialState = {
    data: [],
    loading: false,
    error: null,
    one: {
        data: {},
        loading: false,
    },
};
export const fetchAllRecipes = createAsyncThunk(
    'recipes/fetchAllRecipes',
    async (queries = []) => {
        try {
            const resp = await appwriteHandler.databases.listDocuments(
                envConfig.DATABASE_ID,
                envConfig.RECIPE_COLLECTION_ID,
                [Query.orderDesc('created_at'), ...queries]
            );
            return resp;
        } catch (e) {
            throw e;
        }
    }
);
export const likeRecipe = createAsyncThunk(
    'recipe/likeRecipe',
    async ({ recipeId, data, userId }, { dispatch }) => {
        console.log({ data });
        const disRes = dispatch(likeRecipeR({ data, userId }));
        console.log({ disRes });
        try {
            const resp = await appwriteHandler.databases.updateDocument(
                envConfig.DATABASE_ID,
                envConfig.RECIPE_COLLECTION_ID,
                recipeId,
                data,
                [Permission.update(Role.users())]
            );
            return resp;
        } catch (e) {
            throw e;
        }
    }
);
export const dislikeRecipe = createAsyncThunk(
    'recipe/dislikeRecipe',
    async ({ recipeId, data, userId }, { dispatch }) => {
        try {
            const disRes = dispatch(dislikeRecipeR({ data, userId }));
            console.log({ disRes });

            const resp = await appwriteHandler.databases.updateDocument(
                envConfig.DATABASE_ID,
                envConfig.RECIPE_COLLECTION_ID,
                recipeId,
                data,
                [Permission.update(Role.users())]
            );
            return resp;
        } catch (e) {
            throw e;
        }
    }
);
export const fetchOneRecipe = createAsyncThunk(
    'recipes/fetchOneRecipe',
    async (recipeId) => {
        try {
            const resp = await appwriteHandler.databases.getDocument(
                envConfig.DATABASE_ID,
                envConfig.RECIPE_COLLECTION_ID,
                recipeId,
                [Query.equal('id', [recipeId])]
            );

            return resp;
        } catch (e) {
            throw e;
        }
    }
);

export const recipesSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        setOneRecipe(state, { payload }) {
            state.one.data = payload;
        },
        likeRecipeR(state, { payload }) {
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
        dislikeRecipeR(state, { payload }) {
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
            .addCase(fetchAllRecipes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.documents.map((doc) =>
                    utils.deSerialize(doc, [
                        'ingredients',
                        'instructions',
                        'user',
                        'prep_time',
                        'cook_time',
                    ])
                );
            })
            .addCase(likeRecipe.fulfilled, (state, action) => {
                const doc = utils.deSerialize(action.payload, [
                    'ingredients',
                    'instructions',
                    'user',
                    'prep_time',
                    'cook_time',
                ]);
                console.log({ action, doc });
                state.data = state.data.map((_doc) => {
                    return _doc.id === doc.id ? doc : _doc;
                });
            })
            .addCase(dislikeRecipe.fulfilled, (state, action) => {
                const doc = utils.deSerialize(action.payload, [
                    'ingredients',
                    'instructions',
                    'user',
                    'prep_time',
                    'cook_time',
                ]);
                // console.log({ action, doc });
                state.data = state.data.map((_doc) => {
                    return _doc.id === doc.id ? doc : _doc;
                });
            })

            .addCase(fetchAllRecipes.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchOneRecipe.pending, (state) => {
                state.one.loading = true;
            })
            .addCase(fetchOneRecipe.fulfilled, (state, action) => {
                state.one.loading = false;
                state.one.data = utils.deSerialize(action.payload, [
                    'ingredients',
                    'instructions',
                    'user',
                    'prep_time',
                    'cook_time',
                ]);
            })
            .addCase(fetchOneRecipe.rejected, (state) => {
                state.one.loading = false;
            });
    },
});

// Action creators are generated for each case reducer function
export const { setOneRecipe, likeRecipeR, dislikeRecipeR } =
    recipesSlice.actions;

export default recipesSlice.reducer;
