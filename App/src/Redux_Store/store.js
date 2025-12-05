import { configureStore } from '@reduxjs/toolkit'
import userSlice from './Slices/userSlice'
import callSlice from './Slices/callSlce'
import themeSlice from './Slices/themeSlice'
import socketSlice from './Slices/socketSlice'

const store = configureStore({
    reducer: {
        user: userSlice,
        call: callSlice,
        theme: themeSlice,
        socket: socketSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore socket object in Redux state for serialization checks
                ignoredActions: ['socket/setSocket'],
                ignoredPaths: ['socket.socket'],
            },
        }),
})
export default store
