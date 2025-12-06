import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { disconnectSocket } from './Redux_Store/Slices/socketSlice.js'
import { useNavigate } from 'react-router-dom'
import { registerSocketEvents, unregisterSocketEvents } from './SocketEvents/registerSocketEvents.js'

const SocketManager = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAuthenticated = useSelector(state => state.user.isAuth)
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        if (isAuthenticated && user) {
            // Initialize socket connection
            const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', {
                withCredentials: true,
            })

            // Register all socket event listeners
            registerSocketEvents(socket, dispatch, navigate)

            // Cleanup on unmount or logout
            return () => {
                if (socket) {
                    unregisterSocketEvents(socket)
                    socket.disconnect()
                    dispatch(disconnectSocket())
                }
            }
        } else {
            // Disconnect socket if user logs out
            dispatch(disconnectSocket())
        }
    }, [isAuthenticated, user, dispatch, navigate])

    return null
}
export default SocketManager;