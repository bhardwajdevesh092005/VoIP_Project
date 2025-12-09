import { webrtcManager } from '../../Utils/webrtc.js'

export const handleIceCandidate = () => (data) => {
    console.log('Received ICE candidate:', data.candidate)
    
    if (data.candidate) {
        webrtcManager.addIceCandidate(data.candidate)
    }
}
