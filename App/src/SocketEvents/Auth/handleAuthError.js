import { disconnectSocket } from '../../Redux_Store/Slices/socketSlice.js'

export const handleAuthError = (dispatch, navigate) => (msg) => {
    console.error('Socket authentication error:', msg)
    dispatch(disconnectSocket())
    navigate('/login')
}
