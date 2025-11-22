const UserCard = ({ img, name, phone, status, statusColor = 'text-gray-500 dark:text-gray-400' }) => {
    return (
        <div className="card p-6 flex flex-col items-center w-64 hover:shadow-xl transition-all duration-300">
            <div className="relative">
                <img
                    src={img}
                    alt={name}
                    className="w-24 h-24 rounded-full border-4 border-primary-500 dark:border-primary-600 shadow-lg object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white dark:border-dark-800 ${
                    statusColor === 'pulse' ? 'bg-yellow-400 animate-pulse' : 'bg-accent-500'
                }`}></div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">{name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{phone}</p>
            {status && (
                <div className="mt-3 px-4 py-1 bg-gray-100 dark:bg-dark-700 rounded-full">
                    <p
                        className={`font-semibold text-sm ${
                            statusColor === 'pulse' ? 'text-yellow-600 dark:text-yellow-400 animate-pulse' : statusColor
                        }`}
                    >
                        {status}
                    </p>
                </div>
            )}
        </div>
    )
}

export default UserCard
