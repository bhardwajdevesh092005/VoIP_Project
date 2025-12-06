import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    inCall: false,
    remoteStream: false,
    localStream: false,
    callFrom: {
        name: 'random',
    },
    callRequest: false,
    callingUser: null, // User being called (outgoing call)
    callStatus: 'idle', // 'idle' | 'calling' | 'ringing' | 'connected' | 'ended'
    callId: null, // Current active call ID
}

const callSlice = createSlice({
    name: 'call',
    initialState,
    reducers: {
        setInCall(state, action) {
            state.inCall = action.payload
        },
        setRemoteStream(state, action) {
            state.remoteStream = action.payload
        },
        setLocalStream(state, action) {
            state.localStream = action.payload
        },
        setCallFrom(state, action) {
            state.callFrom = action.payload
        },
        setCallRequest(state, action) {
            state.callRequest = action.payload
        },
        setCallingUser(state, action) {
            state.callingUser = action.payload
        },
        setCallStatus(state, action) {
            state.callStatus = action.payload
        },
        setCallId(state, action) {
            state.callId = action.payload
        },
        resetCallState() {
            return initialState
        },
    },
})

export const { setInCall, setRemoteStream, setLocalStream, setCallFrom, setCallRequest, setCallingUser, setCallStatus, setCallId, resetCallState } =
    callSlice.actions
export default callSlice.reducer
