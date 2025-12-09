// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { setCallRequest, resetCallState, setCallingUser, setCallStatus } from '../../Redux_Store/Slices/callSlce.js'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { webrtcManager } from '../../Utils/webrtc.js'
import { toast } from '../../Utils/toast.js'

const CallRinging = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const caller = useSelector(state => state.call.callFrom)
    const socket = useSelector(state => state.socket.socket)
    const timeoutRef = useRef(null)

    useEffect(() => {
        // Set 60-second timeout for incoming call
        timeoutRef.current = setTimeout(() => {
            console.log('Call timeout - no answer after 60 seconds')
            
            // Clean up any WebRTC resources
            webrtcManager.close()
            
            if (socket && caller?.callerId) {
                socket.emit('call:response', {
                    callerId: caller.callerId,
                    accepted: false,
                    reason: 'No answer'
                })
            }
            dispatch(setCallRequest(false))
            dispatch(resetCallState())
        }, 60000) // 60 seconds

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [caller, socket, dispatch])

    const handleAccept = async () => {
        console.log('Call accepted from:', caller.callerId)
        // Clear timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        
        try {
            // Set caller info in Redux for CallScreen
            dispatch(setCallingUser({
                userID: caller.callerId,
                fullName: caller.name,
                profilePicture: caller.img
            }))
            
            // Set call status to 'ringing' (connecting state for receiver)
            dispatch(setCallStatus('ringing'))
            
            // Initialize WebRTC and create answer
            webrtcManager.setSocket(socket)
            const answer = await webrtcManager.createAnswer(caller.offer)
            
            // Set up connection state monitoring for receiver
            webrtcManager.onConnectionStateChange((state) => {
                console.log('Receiver connection state:', state)
                if (state === 'connected') {
                    console.log('Receiver WebRTC connection established')
                    dispatch(setCallStatus('connected'))
                } else if (state === 'disconnected' || state === 'failed') {
                    console.log('Receiver WebRTC connection lost:', state)
                    dispatch(setCallStatus('ended'))
                }
            })
            
            // Set up remote stream handler
            webrtcManager.onRemoteStream((stream) => {
                console.log('Receiver received remote audio stream')
                // Create an audio element to play the remote stream
                const audioElement = document.getElementById('remote-audio')
                if (audioElement) {
                    audioElement.srcObject = stream
                    audioElement.play().catch(err => console.error('Error playing remote audio:', err))
                }
            })
            
            // Emit response with WebRTC answer
            if (socket) {
                socket.emit('call:response', {
                    callerId: caller.callerId,
                    accepted: true,
                    answer: answer
                })
            }
            
            dispatch(setCallRequest(false))
            // Navigate to call screen
            navigate('/call')
        } catch (error) {
            console.error('Error accepting call:', error)
            const errorMessage = error.message || 'Failed to access microphone. Please check permissions.'
            toast.error(errorMessage)
            
            // Reject the call if WebRTC setup fails
            if (socket) {
                socket.emit('call:response', {
                    callerId: caller.callerId,
                    accepted: false,
                    reason: 'Microphone access denied'
                })
            }
            dispatch(setCallRequest(false))
            dispatch(resetCallState())
        }
    }

    const handleReject = () => {
        console.log('Call rejected from:', caller.callerId)
        // Clear timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        
        // Clean up any WebRTC resources that might have been initialized
        webrtcManager.close()
        
        if (socket) {
            socket.emit('call:response', {
                callerId: caller.callerId,
                accepted: false,
                reason: 'User declined'
            })
        }
        dispatch(setCallRequest(false))
        dispatch(resetCallState())
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 glass-effect rounded-2xl shadow-2xl p-5 w-80 md:w-96 flex items-center gap-4 z-50 border-2 border-primary-400 dark:border-primary-600"
        >
            <div className="relative">
                <img
                    src={caller.img || '/default-avatar.png'}
                    alt={caller.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-primary-500 dark:border-primary-600 shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{caller.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1 animate-pulse text-primary-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                    </svg>
                    Incoming call...
                </p>
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleAccept}
                        className="flex-1 bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleReject}
                        className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default CallRinging
