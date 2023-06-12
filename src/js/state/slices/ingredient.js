import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: [{ header: '', content: [] }],
};

export const ingredientsSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {
        getIngredients: (state) => {
            return state.data;
        },
        updateIngredients: (state, { payload }) => {
            state.data = payload;
        },
        addIngredientContent: (state, { payload }) => {
            state.data[payload?.index].content.push({
                media: '',
                text: payload?.text,
            });
        },
        updateIngredientContent: (state, { payload }) => {
            state.data[payload?.index].content[payload.contentIndex].text =
                payload?.text;
        },
        resetIngredients: (state) => {
            state.data = [{ header: '', content: [] }];
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    updateIngredients,
    getIngredients,
    addIngredientContent,
    updateIngredientContent,
    resetIngredients,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
