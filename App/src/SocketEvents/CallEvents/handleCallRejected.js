import { toast } from '../../Utils/toast.js'
import { setCallStatus, resetCallState } from '../../Redux_Store/Slices/callSlce.js'
import { webrtcManager } from '../../Utils/webrtc.js'

export const handleCallRejected = (dispatch, navigate) => (data) => {
    console.log('Call rejected by:', data.calleeId)
    toast.warning(`Call rejected: ${data.reason || 'User declined'}`)
    
    // Clean up WebRTC connection
    webrtcManager.close()
    
    // Update call status to ended
    dispatch(setCallStatus('ended'))
    
    // Reset call state after a brief delay and navigate to previous page
    setTimeout(() => {
        dispatch(resetCallState())
        navigate(-1)
    }, 2000)
}
