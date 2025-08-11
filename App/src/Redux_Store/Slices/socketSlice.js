import {createSlice} from '@reduxjs/toolkit'
import {io} from 'socket.io-client'

const initialState = {
    socket : null,
    connected: false
}

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        connectSocket: (state)=>{
            state.socket = io(import.meta.env.VITE_SIGNAL_SERVER)
            if(state.socket){
                state.connected = true;
            }
        },
        call: (state,action)=>{
            state.socket.emit(action.payload.event,action.payload.data)
        },
    }
})

export default socketSlice.actions;