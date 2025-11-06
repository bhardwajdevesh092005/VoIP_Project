import { Link } from 'react-router'
import { logout } from '../../Redux_Store/Slices/userSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
const Navbar = () => {
    const disp = useDispatch()
    const isAuthenticated = useSelector(state=>state.user.isAuth);

    const useLogout = () => {
        disp(logout())
    }

    // const useLogin = data => {
    //   const disp = useDispatch()
    //   disp(login(data))
    // }

    const navigate = useNavigate()

    return (
        <nav className="flex text-xl bg-gradient-to-tr from-blue-50 to-white justify-between items-center py-6 px-10 mb-2 rounded-b-xl bg-white shadow-md">
            <img
                src="/Logo.png"
                alt="Logo"
                className="w-[80px] rounded-full h-[60px]"
                onClick={() => navigate('/')}
            />
            <div className="flex space-x-4">
                <ul className="flex space-x-8 py-2 text-gray-700 font-medium">
                    <li>
                        <Link to="/about" className="hover:text-indigo-600">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="hover:text-indigo-600">
                            Contact
                        </Link>
                    </li>
                </ul>

                {isAuthenticated ? (
                    <button
                        onClick={useLogout}
                        className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <button className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition">
                            <Link to="login">Login</Link>
                        </button>
                        <button className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition">
                            <Link to="sign-up">Sign Up</Link>
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
