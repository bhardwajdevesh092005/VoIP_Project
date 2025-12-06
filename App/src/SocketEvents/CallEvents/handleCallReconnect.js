import { setCallingUser, setInCall } from '../../Redux_Store/Slices/callSlce.js'
import { toast } from '../../Utils/toast.js'
import { contactsCache } from '../../Utils/contactsCache.js'

export const handleCallReconnect = (dispatch, navigate) => (data) => {
    console.log('Reconnecting to active call:', data)
    
    // Determine the other user in the call
    const otherUserId = data.isCallee ? data.callerId : data.calleeId
    
    // Try to get contact info from cache
    const cachedContact = contactsCache.getContact(otherUserId)
    
    // Set calling user info
    dispatch(setCallingUser({
        userID: otherUserId,
        fullName: cachedContact?.fullName || 'Unknown User',
        profilePicture: cachedContact?.profilePicture || '/default-avatar.png'
    }))
    
    // Mark as in call
    dispatch(setInCall(true))
    
    // Navigate to call screen
    navigate('/call')
    
    toast.info('Reconnected to active call')
    
    // TODO: Re-establish WebRTC peer connection using offer/answer from data
}
