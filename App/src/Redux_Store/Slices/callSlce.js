import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    inCall: false,
    remoteStream: false,
    localStream: false,
    callFrom: {
        name: "random",
    },
    callRequest: true,
};

const callSlice = createSlice({
    name: "call",
    initialState,
    reducers:{
        setInCall(state, action) {
            state.inCall = action.payload;
        },
        setRemoteStream(state, action) {
            state.remoteStream = action.payload;
        },
        setLocalStream(state, action) {
            state.localStream = action.payload;
        },
        setCallFrom(state, action) {
            state.callFrom = action.payload;
        },
        setCallRequest(state,action){
            state.callRequest = action.payload;
        },
        resetCallState() {
            return initialState;
        }
    }
})

export const {
    setInCall,setRemoteStream,setLocalStream,setCallFrom,resetCallState
} = callSlice.actions;
export default callSlice.reducer;