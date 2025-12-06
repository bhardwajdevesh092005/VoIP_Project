import { toast } from '../../Utils/toast.js'
import { setCallStatus, setCallId } from '../../Redux_Store/Slices/callSlce.js'

export const handleCallAccepted = (dispatch) => (data) => {
    console.log('Call accepted by:', data.calleeId)
    toast.success('Call accepted! Establishing connection...')
    
    // Store the call ID
    if (data.callId) {
        dispatch(setCallId(data.callId))
    }
    
    // Update call status to ringing (connecting/establishing p2p connection state)
    // Will be changed to 'connected' when WebRTC connection is established
    dispatch(setCallStatus('ringing'))
    
    // TODO: Handle WebRTC answer and establish peer connection
    // Once WebRTC connection is successful, dispatch(setCallStatus('connected'))
}
