import { setCallFrom, setCallRequest } from '../../Redux_Store/Slices/callSlce.js'
import { contactsCache } from '../../Utils/contactsCache.js'

export const handleIncomingCall = (dispatch, socket) => (data) => {
    console.log('Incoming call from:', data)
    
    // Try to get contact info from cache
    const cachedContact = contactsCache.getContact(data.callerId)
    console.log(cachedContact)
    
    dispatch(setCallFrom({
        callerId: data.callerId,
        offer: data.offer,
        name: cachedContact?.fullName || data.callerName || 'Unknown Caller',
        img: cachedContact?.profilePicture || data.callerAvatar || '/default-avatar.png'
    }))
    dispatch(setCallRequest(true))
    
    // Emit call:ringing back to server to notify caller
    if (socket) {
        socket.emit('call:ringing', {
            callerId: data.callerId
        })
    }
}
