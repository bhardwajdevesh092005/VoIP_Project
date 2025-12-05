import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    socket: null,
    connected: false,
}

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload
        },
        setConnected: (state, action) => {
            state.connected = action.payload
        },
        disconnectSocket: (state) => {
            if (state.socket) {
                state.socket.disconnect()
            }
            state.socket = null
            state.connected = false
        },
        emit: (state, action) => {
            if (state.socket && state.connected) {
                state.socket.emit(action.payload.event, action.payload.data)
            } else {
                console.warn('Cannot emit: Socket not connected')
            }
        },
    },
})

export const { setSocket, setConnected, disconnectSocket, emit } = socketSlice.actions
export default socketSlice.reducer
