import { setSocket, setConnected } from '../../Redux_Store/Slices/socketSlice.js'

export const handleAuthSuccess = (socket, dispatch) => (data) => {
    console.log('Socket authenticated:', data)
    dispatch(setSocket(socket))
    dispatch(setConnected(true))
}
