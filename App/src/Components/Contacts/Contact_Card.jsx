const ContactCard = ({ name, phone, onCall }) => {
    return (
        <li className="p-4 border border-gray-200 rounded-lg space-x-10  flex items-center justify-between hover:shadow-md transition">
            <div>
                <p className="text-lg font-medium text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{phone}</p>
            </div>
            <button
                onClick={onCall}
                className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition"
            >
                {/* Phone Icon */}
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
