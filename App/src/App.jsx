import { Outlet } from 'react-router'
import Home from './Components/Home/Home.jsx'
import Navbar from './Components/Navbar/Navbar.jsx'
import { useSelector } from 'react-redux'
import CallRinging from './Components/Calling/CallRinging.jsx'
function App() {
    const callRinging = useSelector(state => state.call.callRequest)
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            {callRinging && <CallRinging />}
            <Outlet />
        </div>
    )
}

export default App
