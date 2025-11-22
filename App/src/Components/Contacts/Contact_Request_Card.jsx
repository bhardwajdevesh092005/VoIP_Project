const ContactRequestCard = ({ name, phone, onAccept, onReject }) => {
    return (
        <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-600 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 hover:shadow-md transition-all duration-200 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary-600 dark:bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{phone}</p>
                </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                <button
                    onClick={onAccept}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    Accept
                </button>

                <button
                    onClick={onReject}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    Reject
                </button>
            </div>
        </li>
    )
}

export default ContactRequestCard
