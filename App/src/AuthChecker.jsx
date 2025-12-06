import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import {authAPI} from './Utils/api'
import { login, logout, setLoading } from './Redux_Store/Slices/userSlice'

const AuthChecker = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const checkAuthStatus = async () => {
            dispatch(setLoading(true))
            try {
                const response = await authAPI.getLoginStatus()
                if (response.data.success) {
                    dispatch(login(response.data.data))
                    console.log('User authenticated:', response.data.data)
                    
                    // Redirect to home if user is on login or signup page and is authenticated
                    if (location.pathname === '/login' || location.pathname === '/signup') {
                        navigate('/')
                    }
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
    }, [dispatch, navigate, location.pathname])

    return null
}

export default AuthChecker
