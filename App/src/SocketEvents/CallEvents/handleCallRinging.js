import { toast } from '../../Utils/toast.js'
import { setCallStatus } from '../../Redux_Store/Slices/callSlce.js'

export const handleCallRinging = (dispatch) => (data) => {
    console.log('Call is ringing for:', data.calleeId)
    toast.info('Ringing...')
    
    // Update call status to ringing
    dispatch(setCallStatus('ringing'))
}
