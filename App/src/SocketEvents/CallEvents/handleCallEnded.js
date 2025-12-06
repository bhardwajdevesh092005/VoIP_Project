import { toast } from '../../Utils/toast.js'
import { resetCallState } from '../../Redux_Store/Slices/callSlce.js'

export const handleCallEnded = (dispatch, navigate) => (data) => {
    console.log('Call ended:', data)
    
    if (data.endedBy) {
        toast.warning('Call ended')
    }
    
    // Reset call state
    dispatch(resetCallState())
    
    // Navigate to contacts page
    navigate('/my-contacts')
}
