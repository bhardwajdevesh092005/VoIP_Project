import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { setSocket, setConnected, disconnectSocket } from './Redux_Store/Slices/socketSlice.js'
import { useNavigate } from 'react-router-dom'

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

            // Listen for authentication success
            socket.on('auth:success', (data) => {
                console.log('Socket authenticated:', data)
                dispatch(setSocket(socket))
                dispatch(setConnected(true))
            })

            // Listen for authentication errors
            socket.on('auth:error', (msg) => {
                console.error('Socket authentication error:', msg)
                dispatch(disconnectSocket())
                navigate('/login')
            })

            // Listen for connection events
            socket.on('connect', () => {
                console.log('Socket connected:', socket.id)
            })

            socket.on('disconnect', () => {
                console.log('Socket disconnected')
                dispatch(setConnected(false))
            })

            // Cleanup on unmount or logout
            return () => {
                if (socket) {
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