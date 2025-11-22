// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'

const CallRinging = () => {
    const caller = useSelector(state => state.call.callFrom)
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 glass-effect rounded-2xl shadow-2xl p-5 w-80 md:w-96 flex items-center gap-4 z-50 border-2 border-primary-400 dark:border-primary-600"
        >
            <div className="relative">
                <img
                    src={caller.img}
                    alt={caller.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-primary-500 dark:border-primary-600 shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{caller.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1 animate-pulse text-primary-500"
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
                    Incoming call...
                </p>
                <div className="flex gap-2 mt-3">
                    <button
                        // onClick={onAccept}
                        className="flex-1 bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        Accept
                    </button>
                    <button
                        // onClick={onReject}
                        className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default CallRinging
