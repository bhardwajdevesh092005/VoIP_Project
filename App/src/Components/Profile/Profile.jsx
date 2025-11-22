import { useState } from 'react'
import CallHistoryModal from './Call_History'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

const Profile = () => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const isAuthenticated = useSelector(state => state.user.isAuth)
    const navigate = useNavigate()

    const user = {
        name: 'Devesh Bhardwaj',
        phone: '+918368424747',
        email: 'devesh@example.com',
        joined: 'Jan 15, 2024',
        profile: 'https://cdn-icons-png.flaticon.com/512/206/206853.png',
    }

    const callHistory = [
        { name: 'John Doe', time: 'Aug 7, 2025 - 10:30 AM' },
        { name: 'Jane Smith', time: 'Aug 5, 2025 - 3:45 PM' },
        { name: 'Rahul Sharma', time: 'Aug 1, 2025 - 7:15 PM' },
    ]

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4 pb-10">
            <div className="card p-8 md:p-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="relative">
                        <img
                            src={user.profile}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-primary-500 dark:border-primary-600 shadow-xl"
                        />
                        <div className="absolute bottom-0 right-0 w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center border-4 border-white dark:border-dark-800">
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
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            {user.name}
                        </h1>
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
                                {user.email}
                            </div>
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
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                {user.phone}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center md:justify-start">
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
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                Joined: {user.joined}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-6 rounded-xl text-center border border-primary-200 dark:border-primary-800">
                        <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                            247
                        </p>
                        <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                            Total Calls
                        </p>
                    </div>
                    <div className="bg-secondary-100 dark:bg-secondary-900/30 p-6 rounded-xl text-center border border-secondary-200 dark:border-secondary-800">
                        <p className="text-3xl font-bold text-secondary-700 dark:text-secondary-300">
                            42
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                            Contacts
                        </p>
                    </div>
                    <div className="bg-accent-100 dark:bg-accent-900/30 p-6 rounded-xl text-center border border-accent-200 dark:border-accent-800">
                        <p className="text-3xl font-bold text-accent-700 dark:text-accent-300">
                            12h
                        </p>
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
                    <button className="btn-outline flex items-center justify-center gap-2">
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                        Edit Profile
                    </button>
                </div>
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
