const ContactCard = ({ name, phone, onCall }) => {
    return (
        <li className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-600 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{phone}</p>
                </div>
            </div>
            <button
                onClick={onCall}
                className="flex items-center gap-2 bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.684l1.518 4.553a1 1 0 01-.272 1.06l-2.12 2.12a16.042 16.042 0 006.415 6.415l2.12-2.12a1 1 0 011.06-.272l4.553 1.518a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
                    />
                </svg>
                Call
            </button>
        </li>
    )
}

export default ContactCard
