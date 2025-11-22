import KeyPad from './KeyPad'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../Redux_Store/Slices/userSlice'

const VoipCalling = () => {
    const disp = useDispatch()
    const setUser = () => {
        disp(
            login({
                data: {
                    name: 'Devesh Bhardwaj',
                },
                isAuth: true,
            })
        )
    }
    console.log(useSelector(state => state.user))
    return (
        <div className="h-full w-screen font-sans overflow-hidden">
            <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-10 md:py-20 relative">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-float"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-300 dark:bg-secondary-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-accent-300 dark:bg-accent-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-float animation-delay-4000"></div>
                </div>

                <div className="max-w-xl space-y-6 z-10 w-full md:w-2/3">
                    <div className="flex justify-center md:justify-start">
                        <img
                            className="w-48 md:w-64 hover:scale-105 transition-transform duration-300"
                            src="/Logo.png"
                            alt="Logo"
                        />
                    </div>
                    <h1 className="text-4xl md:text-6xl text-center md:text-left font-extrabold text-gray-900 dark:text-white">
                        VoIP Calling
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center md:text-left leading-relaxed">
                        Experience crystal-clear voice calls over the internet with cutting-edge
                        technology.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                        <button onClick={setUser} className="btn-primary text-lg">
                            Get Started
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 ml-2 inline-block"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </button>
                        <button className="btn-outline text-lg">
                            Try Now
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 ml-2 inline-block"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-8">
                        <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold border border-primary-200 dark:border-primary-800">
                            🔒 Secure
                        </span>
                        <span className="px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm font-semibold border border-secondary-200 dark:border-secondary-800">
                            ⚡ Fast
                        </span>
                        <span className="px-4 py-2 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-sm font-semibold border border-accent-200 dark:border-accent-800">
                            🌍 Global
                        </span>
                    </div>
                </div>

                <div className="relative z-10 flex justify-center w-full md:w-auto mt-10 md:mt-0">
                    <KeyPad />
                </div>
            </section>
        </div>
    )
}

export default VoipCalling
