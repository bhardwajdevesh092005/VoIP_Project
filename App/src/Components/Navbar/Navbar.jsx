import { Link } from 'react-router'
import { logout } from '../../Redux_Store/Slices/userSlice.js'
import { toggleTheme } from '../../Redux_Store/Slices/themeSlice.js'
import { disconnectSocket } from '../../Redux_Store/Slices/socketSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { authAPI } from '../../Utils/api.js'

const Navbar = () => {
    const disp = useDispatch()
    const isAuthenticated = useSelector(state => state.user.isAuth)
    const user = useSelector(state => state.user.user)
    const isDarkMode = useSelector(state => state.theme.isDarkMode)

    const handleLogout = async () => {
        try {
            // Call logout API to clear cookies and refresh token in DB
            await authAPI.logout()
        } catch (error) {
            console.error('Logout API error:', error)
        } finally {
            // Disconnect socket
            disp(disconnectSocket())
            
            // Remove access token from localStorage
            localStorage.removeItem('accessToken')
            
            // Logout from Redux store
            disp(logout())
            
            // Navigate to login page
            navigate('/login')
        }
    }

    const handleToggleTheme = () => {
        disp(toggleTheme())
    }

    const navigate = useNavigate()

    return (
        <nav className="glass-effect sticky top-0 z-50 flex text-lg justify-between items-center py-4 px-6 md:px-10 mb-2 shadow-lg">
            {/* <div className="flex items-center space-x-3"> */}
                <img
                    src="/Logo.png"
                    alt="Logo"
                    className="w-[150px] object-fill -mx-3 cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={() => navigate('/')}
                />
            {/* </div> */}

            <div className="flex items-center space-x-4 md:space-x-6">
                <ul className="flex space-x-6 md:space-x-8 text-gray-700 dark:text-gray-300 font-medium">
                    <li>
                        <Link
                            to="/about"
                            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/contacts"
                            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                        >
                            Contact
                        </Link>
                    </li>
                </ul>

                {/* Dark Mode Toggle */}
                <button
                    onClick={handleToggleTheme}
                    className="p-2 rounded-xl bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 transition-all duration-200"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-yellow-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                        </svg>
                    )}
                </button>

                {isAuthenticated ? (
                    <div className="flex items-center space-x-4">
                        {/* Profile Button */}
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-200"
                            aria-label="Profile"
                        >
                            <img
                                src={user?.profilePicture || '/default-avatar.png'}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
                            />
                            <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
                                {user?.fullName?.split(" ")[0] || 'User'}
                            </span>
                        </button>

                        {/* Logout Button */}
                        <button onClick={handleLogout} className="btn-primary text-sm md:text-base">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-3">
                        <button className="btn-primary text-sm md:text-base">
                            <Link to="login">Login</Link>
                        </button>
                        <button className="btn-outline text-sm md:text-base">
                            <Link to="sign-up">Sign Up</Link>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
