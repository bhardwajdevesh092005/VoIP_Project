import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: false,
    user: null,
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload
        },
        setError(state, action) {
            state.error = action.payload
        },
        login(state, action) {
            state.isAuth = true
            state.user = action.payload
            state.loading = false
            state.error = null
        },
        logout(state) {
            state.isAuth = false
            state.user = null
            state.loading = false
            state.error = null
        },
    },
})

export const { login, logout, setLoading, setError } = userSlice.actions
export default userSlice.reducer
