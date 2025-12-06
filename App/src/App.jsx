import { Outlet } from 'react-router'
import Home from './Components/Home/Home.jsx'
import Navbar from './Components/Navbar/Navbar.jsx'
import { useSelector } from 'react-redux'
import CallRinging from './Components/Calling/CallRinging.jsx'
import { useEffect } from 'react'
import SocketManager from './SocketManager.jsx'
import AuthChecker from './AuthChecker.jsx'
import ToastContainer from './Components/Toast/ToastContainer.jsx'

function App() {
    const callRinging = useSelector(state => state.call.callRequest)
    const isDarkMode = useSelector(state => state.theme.isDarkMode)

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDarkMode])

    return (
        <div className="max-w-full flex flex-col h-screen gradient-bg relative">
            <div className="gradient-orb"></div>
            <Navbar />
            <AuthChecker />
            <SocketManager />
            <ToastContainer />
            {callRinging && <CallRinging />}
            <Outlet />
        </div>
    )
}

export default App
