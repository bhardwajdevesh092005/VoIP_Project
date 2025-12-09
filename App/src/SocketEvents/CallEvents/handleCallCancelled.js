import { resetCallState, setCallRequest } from '../../Redux_Store/Slices/callSlce'
import { toast } from '../../Utils/toast'
import { webrtcManager } from '../../Utils/webrtc'

export const handleCallCancelled = (dispatch, navigate) => (data) => {
    console.log('[handleCallCancelled] Event received:', data)
    
    try {
        // Clean up WebRTC connection
        console.log('[handleCallCancelled] Closing WebRTC connection')
        webrtcManager.close()
        
        // Immediately hide the call request/ringing UI
        console.log('[handleCallCancelled] Hiding call request UI')
        dispatch(setCallRequest(false))
        
        // Reset all call state
        console.log('[handleCallCancelled] Resetting call state')
        dispatch(resetCallState())
        
        // Show notification
        console.log('[handleCallCancelled] Showing toast')
        toast.info('Call was cancelled')
        
        // Navigate back to contacts
        console.log('[handleCallCancelled] Navigating to my-contacts')
        navigate('/my-contacts')
    } catch (error) {
        console.error('[handleCallCancelled] Error:', error)
    }
}
