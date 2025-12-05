import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {authAPI} from './Utils/api'
import { login, logout, setLoading } from './Redux_Store/Slices/userSlice'

const AuthChecker = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const checkAuthStatus = async () => {
            dispatch(setLoading(true))
            try {
                const response = await authAPI.getLoginStatus()
                if (response.data.success) {
                    dispatch(login(response.data.data))
                    console.log('User authenticated:', response.data.data)
                } else {
                    dispatch(logout())
                }
            } catch (error) {
                console.log('User not authenticated:', error.message)
                dispatch(logout())
            } finally {
                dispatch(setLoading(false))
            }
        }

        checkAuthStatus()
    }, [dispatch])

    return null
}

export default AuthChecker
