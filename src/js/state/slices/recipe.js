import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { appwriteHandler, envConfig, utils } from '../../helper';
import { Query } from 'appwrite';
const initialState = {
    data: [],
    loading: false,
    error: null,
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
export const fetchOneRecipe = createAsyncThunk(
    'recipes/fetchOneRecipe',
    async (recipeId, queries) => {
        try {
            const resp = await appwriteHandler.databases.getDocument(
                envConfig.DATABASE_ID,
                envConfig.RECIPE_COLLECTION_ID,
                recipeId
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
    reducers: {},
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
            .addCase(fetchAllRecipes.rejected, (state) => {
                state.loading = false;
            });
    },
});

// Action creators are generated for each case reducer function
// export const { } = postSlice.actions;

export default recipesSlice.reducer;
