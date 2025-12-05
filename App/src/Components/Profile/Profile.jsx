import { useState, useEffect, useMemo } from 'react'
import CallHistoryModal from './Call_History'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { authAPI, callAPI, contactAPI } from '../../Utils/api'
import { login } from '../../Redux_Store/Slices/userSlice'

const Profile = () => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [callHistory, setCallHistory] = useState([])
    const [contacts, setContacts] = useState([])
    const [loadingHistory, setLoadingHistory] = useState(false)
    
    const isAuthenticated = useSelector(state => state.user.isAuth)
    const currentUser = useSelector(state => state.user.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        fullName: '',
        avatar: null,
    })

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: '',
        otp: '',
    })

    const [avatarPreview, setAvatarPreview] = useState('')

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        } else if (currentUser) {
            setFormData({
                fullName: currentUser.fullName || '',
                avatar: null,
            })
            setAvatarPreview(currentUser.profilePicture || '')
            fetchData()
        }
    }, [isAuthenticated, currentUser, navigate])

    const fetchData = async () => {
        setLoadingHistory(true)
        try {
            const [callHistoryResponse, contactsResponse] = await Promise.all([
                callAPI.getCallHistory(),
                contactAPI.getContacts()
            ])
            
            if (callHistoryResponse.data.success) {
                setCallHistory(callHistoryResponse.data.data)
            }
            
            if (contactsResponse.data.success) {
                setContacts(contactsResponse.data.data)
            }
        } catch (err) {
            console.error('Failed to fetch profile data:', err)
        } finally {
            setLoadingHistory(false)
        }
    }

    // Calculate statistics from real data
    const stats = useMemo(() => {
        const totalCalls = callHistory.length
        const totalContacts = contacts.length
        
        // Calculate total call time in seconds
        const totalSeconds = callHistory.reduce((sum, call) => sum + (call.duration || 0), 0)
        
        // Format total time
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        
        let formattedTime = '0m'
        if (hours > 0 && minutes > 0) {
            formattedTime = `${hours}h ${minutes}m`
        } else if (hours > 0) {
            formattedTime = `${hours}h`
        } else if (minutes > 0) {
            formattedTime = `${minutes}m`
        } else if (totalSeconds > 0) {
            formattedTime = `${totalSeconds}s`
        }
        
        return {
            totalCalls,
            totalContacts,
            formattedTime
        }
    }, [callHistory, contacts])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({
                ...prev,
                avatar: file
            }))
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleSendOTP = async () => {
        setError('')
        setSuccess('')
        setLoading(true)
        
        try {
            await authAPI.sendOTP(currentUser.email)
            setOtpSent(true)
            setSuccess('OTP sent to your email')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const data = new FormData()
            if (formData.fullName !== currentUser.fullName) {
                data.append('fullName', formData.fullName)
            }
            if (formData.avatar) {
                data.append('avatar', formData.avatar)
            }

            const response = await authAPI.updateUser(data)
            dispatch(login(response.data.data))
            setSuccess('Profile updated successfully')
            setIsEditing(false)
            setFormData(prev => ({ ...prev, avatar: null }))
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        if (!passwordData.otp) {
            setError('Please enter OTP')
            return
        }

        setLoading(true)

        try {
            await authAPI.updatePassword({
                newPassword: passwordData.newPassword,
                otp: passwordData.otp
            })
            setSuccess('Password updated successfully')
            setIsChangingPassword(false)
            setOtpSent(false)
            setPasswordData({ newPassword: '', confirmPassword: '', otp: '' })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password')
        } finally {
            setLoading(false)
        }
    }

    if (!currentUser) {
        return <div className="flex justify-center items-center h-screen">
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4 pb-10">
            <div className="card p-8 md:p-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="relative">
                        <img
                            src={avatarPreview || 'https://cdn-icons-png.flaticon.com/512/206/206853.png'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-primary-500 dark:border-primary-600 shadow-xl object-cover"
                        />
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center border-4 border-white dark:border-dark-800 cursor-pointer hover:bg-primary-600 transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </label>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        {isEditing ? (
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 bg-transparent border-b-2 border-primary-500 focus:outline-none w-full"
                                placeholder="Full Name"
                            />
                        ) : (
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                {currentUser.fullName}
                            </h1>
                        )}
                        <div className="space-y-2">
                            <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                {currentUser.email}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-3 justify-center md:justify-start flex-wrap">
                            {!isEditing && !isChangingPassword && (
                                <>
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="btn-primary"
                                    >
                                        Edit Profile
                                    </button>
                                     
                                        <button 
                                            onClick={() => setIsChangingPassword(true)}
                                            className="btn-secondary"
                                        >
                                            Change Password
                                        </button>
                                    
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Edit Profile Form */}
                {isEditing && (
                    <form onSubmit={handleUpdateProfile} className="mt-8 space-y-4 border-t pt-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Edit Profile
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-primary disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Save Changes'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => {
                                    setIsEditing(false)
                                    setFormData({
                                        fullName: currentUser.fullName,
                                        avatar: null
                                    })
                                    setAvatarPreview(currentUser.profilePicture)
                                    setError('')
                                    setSuccess('')
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Change Password Form */}
                {isChangingPassword && (
                    <div className="mt-8 space-y-4 border-t pt-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            Change Password
                        </h3>
                        
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            {/* OTP Warning - Show after OTP is sent */}
                            {otpSent && (
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg flex items-start space-x-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                            OTP Valid for 10 Minutes
                                        </p>
                                        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                                            Please enter the OTP within 10 minutes. After that, you'll need to request a new one.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="input-field"
                                    required
                                    minLength={6}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="input-field"
                                    required
                                    minLength={6}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            {/* OTP Request Section */}
                            {!otpSent ? (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
                                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                                        To change your password, you need to verify your email: <strong>{currentUser.email}</strong>
                                    </p>
                                    <button 
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={loading}
                                        className="btn-primary disabled:opacity-50 w-full sm:w-auto"
                                    >
                                        {loading ? 'Sending OTP...' : 'Request OTP to Continue'}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        OTP (sent to {currentUser.email})
                                    </label>
                                    <input
                                        type="text"
                                        name="otp"
                                        value={passwordData.otp}
                                        onChange={handlePasswordChange}
                                        className="input-field"
                                        required
                                        maxLength={6}
                                        placeholder="Enter 6-digit OTP"
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={loading}
                                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-2"
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button 
                                    type="submit"
                                    disabled={loading || !otpSent}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={!otpSent ? 'Please request OTP first' : ''}
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsChangingPassword(false)
                                        setOtpSent(false)
                                        setPasswordData({ newPassword: '', confirmPassword: '', otp: '' })
                                        setError('')
                                        setSuccess('')
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Stats Section */}
                {!isEditing && !isChangingPassword && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-primary-100 dark:bg-primary-900/30 p-6 rounded-xl text-center border border-primary-200 dark:border-primary-800">
                                {loadingHistory ? (
                                    <div className="text-2xl text-primary-600 dark:text-primary-400">...</div>
                                ) : (
                                    <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                                        {stats.totalCalls}
                                    </p>
                                )}
                                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                                    Total Calls
                                </p>
                            </div>
                            <div className="bg-secondary-100 dark:bg-secondary-900/30 p-6 rounded-xl text-center border border-secondary-200 dark:border-secondary-800">
                                {loadingHistory ? (
                                    <div className="text-2xl text-secondary-600 dark:text-secondary-400">...</div>
                                ) : (
                                    <p className="text-3xl font-bold text-secondary-700 dark:text-secondary-300">
                                        {stats.totalContacts}
                                    </p>
                                )}
                                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                                    Contacts
                                </p>
                            </div>
                            <div className="bg-accent-100 dark:bg-accent-900/30 p-6 rounded-xl text-center border border-accent-200 dark:border-accent-800">
                                {loadingHistory ? (
                                    <div className="text-2xl text-accent-600 dark:text-accent-400">...</div>
                                ) : (
                                    <p className="text-3xl font-bold text-accent-700 dark:text-accent-300">
                                        {stats.formattedTime}
                                    </p>
                                )}
                                <p className="text-sm text-accent-600 dark:text-accent-400 mt-1">
                                    Call Time
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                View Call History
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            <CallHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={callHistory}
            />
        </div>
    )
}

export default Profile
