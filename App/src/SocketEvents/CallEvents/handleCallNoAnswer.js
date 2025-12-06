import { toast } from '../../Utils/toast.js'
import { setCallStatus, resetCallState } from '../../Redux_Store/Slices/callSlce.js'

export const handleCallNoAnswer = (dispatch, navigate) => (data) => {
    console.log('Call not answered by:', data.calleeId)
    toast.warning('Call not answered')
    
    // Update call status to ended
    dispatch(setCallStatus('ended'))
    
    // Reset call state after a brief delay
    setTimeout(() => {
        dispatch(resetCallState())
        navigate('/my-contacts')
    }, 2000)
}
