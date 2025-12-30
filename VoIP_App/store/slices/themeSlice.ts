import { createSlice } from "@reduxjs/toolkit";
import { type ThemeType, themes } from "@/app/styles/colorThemes";
const themeSlice = createSlice({
    name: "theme",
    initialState: {
        colorMode: 'dark' as 'light' | 'dark',
        colorTheme: themes['oceanic'] ?? themes['oceanic'] as ThemeType,
    },
    reducers: {
        toggleTheme: (state, action: { payload: 'light' | 'dark' }) => {
            state.colorMode = action.payload;
        },
        changeColorTheme: (state, action: { payload: ThemeType }) => {
            state.colorTheme = action.payload;
        },
    },
});

export const { toggleTheme, changeColorTheme } = themeSlice.actions;
export default themeSlice;