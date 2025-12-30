import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/user.slice'
import themeSlice from './slices/themeSlice'
export const store = configureStore({
    reducer: {
        'user': userSlice.reducer,
        'theme': themeSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch