import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuth: true,
    data: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state,action){
            state.isAuth =  true,
            state.user = action.payload;
        },
        logout(state){
            state.isAuth = false,
            state.user = null
        }
    },
})

export const {login, logout} = userSlice.actions;
export default userSlice.reducer