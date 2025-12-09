import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { authAPI } from '../../Utils/api'
import { login } from '../../Redux_Store/Slices/userSlice'
import { toast } from '../../Utils/toast'

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [sendingOtp, setSendingOtp] = useState(false)
    const [error, setError] = useState('')
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [avatarFile, setAvatarFile] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        formState: { errors },
    } = useForm()

    const password = watch('password')
    // const email = watch('email')

    const handleSendOTP = async () => {
        const emailValue = getValues('email')
        
        if (!emailValue) {
            setError('Please enter your email first')
            return
        }

        if (!/^\S+@\S+$/i.test(emailValue)) {
            setError('Please enter a valid email address')
            return
        }

        setSendingOtp(true)
        setError('')

        try {
            await authAPI.sendOTP(emailValue)
            setOtpSent(true)
            toast.success('OTP sent to your email!')
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setSendingOtp(false)
        }
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async (data) => {
        setError('')
        
        // Check if passwords match
        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (!otpSent) {
            setError('Please request OTP first')
            return
        }

        if (!avatarFile) {
            setError('Please upload a profile picture')
            return
        }

        setLoading(true)

        try {
            const formData = new FormData()
            formData.append('fullName', data.fullName)
            formData.append('email', data.email)
            formData.append('password', data.password)
            formData.append('otp', data.otp)
            formData.append('avatar', avatarFile)

            const response = await authAPI.register(formData)

            if (response.data.success) {
                toast.success('Account created successfully!')
                
                // Update Redux store with user data if returned
                if (response.data.data) {
                    dispatch(login(response.data.data))
                }
                
                // Navigate to login
                navigate('/login')
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.'
            setError(errorMessage)
            toast.error(errorMessage)
            console.error('Signup error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-full flex flex-col items-center justify-center px-4 py-8">
            <div className="card p-8 md:p-10 w-full max-w-md">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="mb-4">
                        <img src="/Logo.png" alt="" className="h-[60px] w-[200px] object-cover" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Create Account
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Join us and start calling today
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Avatar Upload */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Profile Picture
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-dark-600 flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="avatar"
                                    onChange={handleAvatarChange}
                                />
                                <label
                                    htmlFor="avatar"
                                    className="cursor-pointer inline-block px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm font-medium"
                                >
                                    Choose Image
                                </label>
                                {errors.avatar && (
                                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                        {errors.avatar.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="input-field"
                            {...register('fullName', { required: 'Full name is required' })}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter your email"
                                className="input-field flex-1"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email format',
                                    },
                                })}
                            />
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={sendingOtp || otpSent}
                                className="px-4 py-2 bg-secondary-600 dark:bg-secondary-500 text-white rounded-lg hover:bg-secondary-700 dark:hover:bg-secondary-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {sendingOtp ? 'Sending...' : otpSent ? '✓ Sent' : 'Get OTP'}
                            </button>
                        </div>
                        {errors.email && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* OTP Field - Only show after OTP is sent */}
                    {otpSent && (
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                OTP (Check your email)
                            </label>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                maxLength="6"
                                className="input-field"
                                {...register('otp', {
                                    required: 'OTP is required',
                                    pattern: {
                                        value: /^[0-9]{6}$/,
                                        message: 'OTP must be 6 digits',
                                    },
                                })}
                            />
                            {errors.otp && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                    {errors.otp.message}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Valid for 10 minutes. Check your spam folder if you don't see it.
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Phone
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your phone number"
                            className="input-field"
                            {...register('phone', {
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Invalid phone number (10 digits)',
                                },
                            })}
                        />
                        {errors.phone && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                className="input-field pr-12"
                                {...register('password', { 
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
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

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                className="input-field pr-12"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value => value === password || 'Passwords do not match'
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <img className="w-6 h-6" src="eye-close.svg" alt="Hide" />
                                ) : (
                                    <img className="w-6 h-6" src="/eye-open.svg" alt="Show" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-secondary w-full text-base mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating account...
                            </>
                        ) : (
                            <>
                                Sign Up
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

                    <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to={'/login'}
                            className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 font-semibold transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
