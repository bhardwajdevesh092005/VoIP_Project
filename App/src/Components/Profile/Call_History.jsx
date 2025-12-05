const CallHistoryModal = ({ isOpen, onClose, history }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-lg p-6 md:p-8 animate-in">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-dark-700 pb-4 mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-primary-600 dark:text-primary-400"
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
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Call History
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-gray-500 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {history.length > 0 ? (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {history.map((call) => (
                            <li
                                key={call.callId}
                                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-dark-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors border border-gray-200 dark:border-dark-600"
                            >
                                <div className="flex items-center space-x-3 flex-1">
                                    <img
                                        src={call.participantAvatar || 'https://cdn-icons-png.flaticon.com/512/206/206853.png'}
                                        alt={call.participantName}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-primary-300 dark:border-primary-700"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                                            {call.participantName || 'Unknown'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {call.formattedTime}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                            {call.formattedDuration}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
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
                        <p className="text-gray-500 dark:text-gray-400">No call history available.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CallHistoryModal
