import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import UserCard from './UserCard'
import { setCallStatus } from '../../Redux_Store/Slices/callSlce'
import { webrtcManager } from '../../Utils/webrtc.js'

const CallScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const callingUser = useSelector(state => state.call.callingUser)
    const currentUser = useSelector(state => state.user.user)
    const callStatus = useSelector(state => state.call.callStatus)
    const socket = useSelector(state => state.socket.socket)
    const [isMuted, setIsMuted] = useState(false)
    
    useEffect(() => {
        // Redirect if no calling user data
        if (!callingUser) {
            navigate('/my-contacts')
            return
        }

        // Set up remote stream handler when component mounts
        webrtcManager.onRemoteStream((stream) => {
            console.log('CallScreen received remote audio stream')
            const audioElement = document.getElementById('remote-audio')
            if (audioElement) {
                audioElement.srcObject = stream
                audioElement.play().catch(err => console.error('Error playing remote audio:', err))
            }
        })

        // Cleanup function - ensure WebRTC is closed when component unmounts
        return () => {
            console.log('CallScreen unmounting - cleaning up WebRTC');
            const audioElement = document.getElementById('remote-audio');
            if (audioElement) {
                audioElement.pause();
                audioElement.srcObject = null;
            }
        }
    }, [callingUser, navigate])

    const handleEndCall = () => {
        console.log('[CallScreen] handleEndCall called')
        console.log('[CallScreen] Socket exists:', !!socket)
        console.log('[CallScreen] Call status:', callStatus)
        
        if (socket) {
            // If call is not yet connected (still calling/ringing), cancel it
            // Otherwise, end the active call
            if (callStatus === 'calling' || callStatus === 'ringing') {
                console.log('[CallScreen] Emitting call:cancel event')
                socket.emit('call:cancel', {})
                // Don't set status to ended here - let the server response handle it
                // This prevents UI confusion while waiting for server confirmation
            } else {
                console.log('[CallScreen] Emitting call:end event')
                // Set call status to ended for immediate UI feedback
                dispatch(setCallStatus('ended'))
                socket.emit('call:end', {})
            }
        } else {
            console.error('[CallScreen] No socket available!')
        }
    }

    const handleToggleMute = () => {
        const isEnabled = webrtcManager.toggleAudio()
        setIsMuted(!isEnabled)
        console.log('[CallScreen] Audio muted:', !isEnabled)
    }

    if (!callingUser || !currentUser) {
        return null
    }

    const otherUser = {
        name: callingUser.fullName || 'Unknown',
        phone: callingUser.email || '',
        img: callingUser.profilePicture || '/default-avatar.png',
    }

    const user = {
        name: currentUser.fullName || 'You',
        phone: currentUser.email || '',
        img: currentUser.profilePicture || '/default-avatar.png',
    }

    // Determine status text based on callStatus
    const getStatusText = () => {
        switch (callStatus) {
            case 'calling':
                return 'Calling...'
            case 'ringing':
                return 'Connecting...'
            case 'connected':
                return 'Connected'
            case 'ended':
                return 'Call Ended'
            default:
                return 'Calling...'
        }
    }

    const getSubStatusText = () => {
        switch (callStatus) {
            case 'calling':
                return 'Initiating call...'
            case 'ringing':
                return 'Establishing connection...'
            case 'connected':
                return 'Call in progress'
            case 'ended':
                return 'Call has ended'
            default:
                return 'Connecting...'
        }
    }

    const isConnected = callStatus === 'connected'

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4">
            {/* Hidden audio element for remote stream */}
            <audio id="remote-audio" autoPlay playsInline></audio>
            
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {getStatusText()}
                </h1>
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                    <div className={`w-3 h-3 rounded-full ${
                        callStatus === 'connected' 
                            ? 'bg-accent-500' 
                            : callStatus === 'ringing'
                            ? 'bg-blue-400 animate-pulse'
                            : 'bg-yellow-400 animate-pulse'
                    }`}></div>
                    <p className="text-sm">
                        {getSubStatusText()}
                    </p>
                </div>
            </div>            <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-10">
                <UserCard
                    img={otherUser.img}
                    name={otherUser.name}
                    phone={otherUser.phone}
                    status={callStatus === 'connected' ? 'Connected' : callStatus === 'ringing' ? 'Connecting...' : 'Calling...'}
                    statusColor={callStatus === 'connected' ? 'text-accent-500 dark:text-accent-400' : 'pulse'}
                />
                {isConnected && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <UserCard
                            img={user.img}
                            name={user.name}
                            phone={user.phone}
                            status="Connected"
                            statusColor="text-accent-500 dark:text-accent-400"
                        />
                    </motion.div>
                )}
            </div>

            {/* Call Controls */}
            <div className="flex gap-6 items-center justify-center">
                {/* Mute Button */}
                <button 
                    className={`p-5 ${
                        isMuted 
                            ? 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600' 
                            : 'bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600'
                    } rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 ${
                        !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!isConnected}
                    onClick={handleToggleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-gray-700 dark:text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            />
                        </svg>
                    )}
                </button>

                {/* End Call Button */}
                <button 
                    className="p-6 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                    onClick={handleEndCall}
                    title="End Call"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-7 h-7 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                        />
                    </svg>
                </button>

                {/* Video Button - Commented out for now */}
                {/* <button 
                    className="p-5 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                    disabled={!isConnected}
                    title="Toggle Camera"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-700 dark:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                </button> */}
            </div>
        </div>
    )
}

export default CallScreen
