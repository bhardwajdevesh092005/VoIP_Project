import KeyPad from './KeyPad'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../Redux_Store/Slices/userSlice';                                                                                                                                 
const VoipCalling = () => {
    const disp = useDispatch()
    const setUser = ()=>{
        disp(login({
            data:{
                name:"Devesh Bhardwaj",
            },
            isAuth: true,
        }))
    }
    console.log(useSelector(state=>state.user));
    return (
        <div className="h-full w-screen bg-white font-sans">
            <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 relative overflow-hidden">
                <div className="max-w-xl space-y-6 z-10 w-2/3">
                    <img className="rounded-lg" src="/Logo.png" alt="Logo" />
                    <h1 className="text-5xl text-center font-bold text-gray-900">VoIP Calling</h1>
                    <p className="text-lg text-gray-600 text-center">
                        Make crystal-clear voice calls over the internet.
                    </p>
                    <div className="flex space-x-4 justify-center">
                        <button onClick={setUser} className="bg-indigo-500 text-white px-6 py-3 rounded-full text-lg hover:bg-indigo-600 transition">
                            Get Started
                        </button>
                        <button className="border-2 border-gray-700 text-gray-800 px-6 py-3 rounded-full text-lg hover:bg-gray-100 transition">
                            Try Now
                        </button>
                    </div>
                </div>
                <div className="relative z-10 flex justify-center w-full">
                    <KeyPad />
                </div>
                <img
                    src="/Hero1.png"
                    alt="Hero"
                    className="rounded-xl absolute scale-[0.60] right-0 bottom-0 opacity-50 pointer-events-none select-none"
                />
            </section>
        </div>
    )
}

export default VoipCalling
