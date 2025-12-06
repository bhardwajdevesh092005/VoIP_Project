import { setConnected } from '../../Redux_Store/Slices/socketSlice.js'

export const handleDisconnect = (dispatch) => () => {
    console.log('Socket disconnected')
    dispatch(setConnected(false))
}
