import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { disconnectSocket } from './Redux_Store/Slices/socketSlice.js'
import { useNavigate } from 'react-router-dom'
import { registerSocketEvents, unregisterSocketEvents } from './SocketEvents/registerSocketEvents.js'

const SocketManager = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAuthenticated = useSelector(state => state.user.isAuth)
    const user = useSelector(state => state.user.user)
    const socketRef = useRef(null)
    const navigateRef = useRef(navigate)

    // Update navigate ref when it changes (don't trigger reconnection)
    useEffect(() => {
        navigateRef.current = navigate
    }, [navigate])

    useEffect(() => {
        if (isAuthenticated && user) {
            // Only create socket if it doesn't exist
            if (!socketRef.current) {
                console.log('Creating new socket connection')
                const socket = io(import.meta.env.VITE_BACKEND_URL || 'https://192.168.1.50:3000', {
                    withCredentials: true,
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionAttempts: 5,
                    secure: true,
                    rejectUnauthorized: false // Allow self-signed certificates in development
                })

                socketRef.current = socket

                // Register all socket event listeners
                registerSocketEvents(socket, dispatch, navigateRef.current)
            }

            // Cleanup on unmount or logout
            return () => {
                // Only disconnect if user is logging out (not on navigation)
                if (!isAuthenticated) {
                    if (socketRef.current) {
                        console.log('Disconnecting socket due to logout')
                        unregisterSocketEvents(socketRef.current)
                        socketRef.current.disconnect()
                        socketRef.current = null
                        dispatch(disconnectSocket())
                    }
                }
            }
        } else {
            // Disconnect socket if user logs out
            if (socketRef.current) {
                console.log('Disconnecting socket - user logged out')
                unregisterSocketEvents(socketRef.current)
                socketRef.current.disconnect()
                socketRef.current = null
            }
            dispatch(disconnectSocket())
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user?.userID, dispatch])

    return null
}
export default SocketManager;