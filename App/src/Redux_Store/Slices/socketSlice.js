import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'

const initialState = {
    socket: null,
    connected: false,
}

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        connectSocket: (state) => {
            try {
                state.socket = io(import.meta.env.VITE_SIGNAL_SERVER)
            } catch (error) {
                console.log("Could Not Connect to socket",error.message);
            }
            if (state.socket) {
                state.connected = true
            }
        },
        emit: (state, action) => {
            state.socket.emit(action.payload.event, action.payload.data)
        },
    },
})

export default socketSlice.actions
