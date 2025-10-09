import { useDispatch } from 'react-redux'
import { login, logout } from '../../Redux_Store/Slices/userSlice.js'

export const useLogin = data => {
    const disp = useDispatch()
    disp(login(data))
}
export const useLogout = () => {
    const disp = useDispatch()
    console.log('Inside useLogout')
    disp(logout())
}
