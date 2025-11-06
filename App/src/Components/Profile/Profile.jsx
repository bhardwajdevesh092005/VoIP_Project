import { useState } from 'react'
import CallHistoryModal from './Call_History'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
const Profile = () => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const isAuthenticated = useSelector(state=>state.user.isAuth);
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
        <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
            <div className="flex items-center space-x-6">
                <img
                    src={user.profile}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border-4 border-indigo-500"
                />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.phone}</p>
                    <p className="text-sm text-gray-400">Joined: {user.joined}</p>
                </div>
            </div>

            <div className="mt-8 flex gap-4">
                <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center gap-2 bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition"
                >
                    {/* History SVG */}
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
