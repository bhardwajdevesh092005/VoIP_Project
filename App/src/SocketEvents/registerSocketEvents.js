import {
    handleAuthSuccess,
    handleAuthError,
    handleConnect,
    handleDisconnect,
    handleConnectionRejected,
    handleIncomingCall,
    handleCallError,
    handleCallAccepted,
    handleCallRejected,
    handleCallNoAnswer,
    handleCallReconnect,
    handleCallRinging,
    handleCallEnded
} from './index.js'

/**
 * Register all socket event listeners
 * @param {Socket} socket - Socket.IO client instance
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} navigate - React Router navigate function
 */
export const registerSocketEvents = (socket, dispatch, navigate) => {
    // Authentication events
    socket.on('auth:success', handleAuthSuccess(socket, dispatch))
    socket.on('auth:error', handleAuthError(dispatch, navigate))

    // Connection events
    socket.on('connect', handleConnect(socket))
    socket.on('disconnect', handleDisconnect(dispatch))
    socket.on('connection:rejected', handleConnectionRejected(dispatch, navigate))

    // Call events
    socket.on('call:incoming', handleIncomingCall(dispatch, socket))
    socket.on('call:error', handleCallError())
    socket.on('call:accepted', handleCallAccepted(dispatch))
    socket.on('call:rejected', handleCallRejected(dispatch, navigate))
    socket.on('call:no-answer', handleCallNoAnswer(dispatch, navigate))
    socket.on('call:reconnect', handleCallReconnect(dispatch, navigate))
    socket.on('call:ringing', handleCallRinging(dispatch))
    socket.on('call:ended', handleCallEnded(dispatch, navigate))
}


/**
 * Cleanup all socket event listeners
 * @param {Socket} socket - Socket.IO client instance
 */
export const unregisterSocketEvents = (socket) => {
    if (!socket) return

    // Remove all registered event listeners
    socket.off('auth:success')
    socket.off('auth:error')
    socket.off('connect')
    socket.off('disconnect')
    socket.off('connection:rejected')
    socket.off('call:incoming')
    socket.off('call:error')
    socket.off('call:accepted')
    socket.off('call:rejected')
    socket.off('call:no-answer')
    socket.off('call:reconnect')
    socket.off('call:ringing')
    socket.off('call:ended')
}
