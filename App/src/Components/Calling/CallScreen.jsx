import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import UserCard from './UserCard'

const CallScreen = () => {
    const [otherUserJoined, setOtherUserJoined] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setOtherUserJoined(true)
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    const user = {
        name: 'You',
        phone: '+918368424747',
        img: '/profile.jpg',
    }

    const otherUser = {
        name: 'John Doe',
        phone: '+919876543210',
        img: '/other-profile.jpg',
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {!otherUserJoined ? 'Calling...' : 'Connected'}
                </h1>
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                    <div className={`w-3 h-3 rounded-full ${!otherUserJoined ? 'bg-yellow-400 animate-pulse' : 'bg-accent-500'}`}></div>
                    <p className="text-sm">
                        {!otherUserJoined ? 'Waiting for response...' : 'Call in progress'}
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-10">
                <UserCard
                    img={otherUser.img}
                    name={otherUser.name}
                    phone={otherUser.phone}
                    status={!otherUserJoined ? 'Ringing...' : 'Connected'}
                    statusColor={!otherUserJoined ? 'pulse' : 'text-accent-500 dark:text-accent-400'}
                />
                {otherUserJoined && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <UserCard
                            img={user.img}
                            name={user.name}
                            phone={user.phone}
                            status="Connected"
                            statusColor="text-accent-500 dark:text-accent-400"
                        />
                    </motion.div>
                )}
            </div>

            {/* Call Controls */}
            <div className="flex gap-4">
                <button className="p-4 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-700 dark:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                        />
                    </svg>
                </button>
                <button className="p-4 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                        />
                    </svg>
                </button>
                <button className="p-4 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-700 dark:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default CallScreen
