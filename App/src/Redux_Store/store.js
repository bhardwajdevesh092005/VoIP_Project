import { configureStore } from '@reduxjs/toolkit'
import userSlice from './Slices/userSlice'
import callSlice from './Slices/callSlce'
import themeSlice from './Slices/themeSlice'

const store = configureStore({
    reducer: {
        user: userSlice,
        call: callSlice,
        theme: themeSlice,
    },
})
export default store
