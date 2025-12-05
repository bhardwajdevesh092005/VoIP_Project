import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { authAPI } from '../../Utils/api'
import { login } from '../../Redux_Store/Slices/userSlice'

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        setError('')
        setLoading(true)
        
        try {
            const response = await authAPI.login({
                email: data.emailOrPhone,
                password: data.password
            })

            if (response.data.success) {
                // Store access token if provided
                if (response.data.data.accessToken) {
                    localStorage.setItem('accessToken', response.data.data.accessToken)
                }

                // Update Redux store with user data
                dispatch(login(response.data.data))

                // Navigate to home page
                navigate('/')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
            console.error('Login error:', err)
        } finally {
            setLoading(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    }

    return (
        <div className="h-full flex items-center justify-center px-4 py-8">
            <div className="card p-8 md:p-10 w-full max-w-md">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="mb-4">
                        <img src="/Logo.png" alt="" className="w-[200px] h-[60px] object-cover" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Login to continue your journey
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Email / Phone
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter your email or phone"
                                className="input-field"
                                {...register('emailOrPhone', {
                                    required: 'Email or phone is required',
                                })}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        {errors.emailOrPhone && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.emailOrPhone.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={!showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="input-field pr-12"
                                {...register('password', { required: 'Password is required' })}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                {showPassword ? (
                                    <img className="w-6 h-6" src="eye-close.svg" alt="Hide" />
                                ) : (
                                    <img className="w-6 h-6" src="/eye-open.svg" alt="Show" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="text-right">
                        <a
                            href="#"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </>
                        ) : (
                            <>
                                Login
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 ml-2 inline-block"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </>
                        )}
                    </button>

                    <div className="flex items-center my-5">
                        <hr className="flex-grow border-gray-300 dark:border-dark-600" />
                        <span className="mx-3 text-gray-500 dark:text-gray-400 text-sm font-medium">
                            OR
                        </span>
                        <hr className="flex-grow border-gray-300 dark:border-dark-600" />
                    </div>

                    <button
                        type="button"
                        onClick={() => window.location.href = 'http://localhost:3000/api/v1/user/googleLogin'}
                        className="flex items-center justify-center w-full py-3 border-2 border-gray-300 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200 font-semibold text-gray-700 dark:text-gray-300"
                    >
                        <img src="/google.webp" alt="Google" className="w-6 h-6 mr-3" />
                        Continue with Google
                    </button>

                    <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link
                            to={'/sign-up'}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
