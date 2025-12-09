import { toast } from '../../Utils/toast.js'
import { resetCallState } from '../../Redux_Store/Slices/callSlce.js'
import { webrtcManager } from '../../Utils/webrtc.js'

export const handleCallEnded = (dispatch, navigate) => (data) => {
    console.log('Call ended:', data)
    
    if (data.endedBy) {
        toast.warning('Call ended')
    }
    
    // Close WebRTC connection and cleanup
    webrtcManager.close()
    
    // Reset call state
    dispatch(resetCallState())
    
    // Navigate to contacts page
    navigate('/my-contacts')
}
