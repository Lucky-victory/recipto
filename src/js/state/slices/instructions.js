import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: [{ header: '', content: [] }],
};

export const InstructionSlice = createSlice({
    name: 'Instruction',
    initialState,
    reducers: {
        getInstructions: (state) => {
            state.data = state.data;
        },
        updateInstructions: (state, { payload }) => {
            state.data = payload;
        },
        updateInstructionContentFull: (state, action) => {
            const { index, newContent } = action.payload;
            state.data[index].content = newContent;
        },

        addInstructionContent: (state, { payload }) => {
            state.data[payload?.index].content.push({
                media: '',
                text: payload?.text,
            });
        },
        updateInstructionContent: (state, { payload }) => {
            state.data[payload?.index].content[payload.contentIndex].text =
                payload?.text;
        },
        resetInstructions: (state) => {
            state.data = [{ header: '', content: [] }];
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    updateInstructions,
    getInstructions,
    addInstructionContent,
    updateInstructionContent,
    resetInstructions,
    updateInstructionContentFull,
} = InstructionSlice.actions;

export default InstructionSlice.reducer;
