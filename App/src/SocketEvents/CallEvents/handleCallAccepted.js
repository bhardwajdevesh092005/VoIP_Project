import { toast } from '../../Utils/toast.js'
import { setCallStatus, setCallId } from '../../Redux_Store/Slices/callSlce.js'
import { webrtcManager } from '../../Utils/webrtc.js'

export const handleCallAccepted = (dispatch) => async (data) => {
    console.log('Call accepted by:', data.calleeId)
    toast.success('Call accepted! Establishing connection...')
    
    try {
        // Store the call ID
        if (data.callId) {
            dispatch(setCallId(data.callId))
        }
        
        // Handle WebRTC answer to complete the connection
        if (data.answer) {
            await webrtcManager.handleAnswer(data.answer)
            console.log('WebRTC answer processed')
        }
        
        // Set up connection state monitoring
        webrtcManager.onConnectionStateChange((state) => {
            console.log('Caller WebRTC Connection state:', state)
            if (state === 'connected') {
                console.log('Caller WebRTC connection established')
                dispatch(setCallStatus('connected'))
                toast.success('Call connected!')
            } else if (state === 'disconnected' || state === 'failed') {
                console.log('Caller WebRTC connection lost:', state)
                toast.error('Connection lost')
            }
        })
        
        // Set up remote stream handler
        webrtcManager.onRemoteStream((stream) => {
            console.log('Caller received remote audio stream')
            // Create an audio element to play the remote stream
            const audioElement = document.getElementById('remote-audio')
            if (audioElement) {
                audioElement.srcObject = stream
                audioElement.play().catch(err => console.error('Error playing remote audio:', err))
            }
        })
        
        // Update call status to ringing (connecting/establishing p2p connection state)
        dispatch(setCallStatus('ringing'))
    } catch (error) {
        console.error('Error handling call acceptance:', error)
        toast.error('Failed to establish connection')
    }
}
