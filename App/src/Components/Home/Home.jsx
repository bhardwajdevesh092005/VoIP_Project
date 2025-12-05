import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const VoipCalling = () => {
    const navigate = useNavigate()
    const isAuthenticated = useSelector(state => state.user.isAuth)
    
    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/my-contacts')
        } else {
            navigate('/login')
        }
    }

    return (
        <div className="h-full w-screen font-sans overflow-y-auto overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-10 py-20">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-96 h-96 bg-yellow-400 dark:bg-yellow-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-yellow-200 dark:bg-yellow-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10">
                    {/* Left Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-yellow-400 leading-tight">
                                Connect
                                <span className="block text-yellow-500 dark:text-yellow-300">Anywhere</span>
                                <span className="block">Anytime</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-700 dark:text-yellow-100/80 leading-relaxed max-w-lg">
                                Experience crystal-clear voice calls with our next-generation VoIP platform. 
                                Secure, fast, and reliable communication at your fingertips.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleGetStarted}
                                className="btn-primary text-lg px-8 py-4 group"
                            >
                                Get Started
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform"
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
                            <button 
                                onClick={() => navigate('/about')}
                                className="btn-outline text-lg px-8 py-4"
                            >
                                Learn More
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">99.9%</div>
                                <div className="text-sm text-gray-600 dark:text-yellow-100/60">Uptime</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">50ms</div>
                                <div className="text-sm text-gray-600 dark:text-yellow-100/60">Latency</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">24/7</div>
                                <div className="text-sm text-gray-600 dark:text-yellow-100/60">Support</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Animated Logo */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center items-center"
                    >
                        <div className="relative group">
                            {/* Rotating glow rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full"
                            >
                                <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-500 rounded-full -translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-400"></div>
                                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full -translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-400"></div>
                                <div className="absolute left-0 top-1/2 w-2 h-2 bg-yellow-600 rounded-full -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-400"></div>
                                <div className="absolute right-0 top-1/2 w-2 h-2 bg-yellow-300 rounded-full -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-400"></div>
                            </motion.div>
                            
                            {/* Pulsing glow effect */}
                            {/* <motion.div
                                animate={{ 
                                    scale: [1, 1.5, 1]
                                }}
                                transition={{ 
                                    duration: 3,        
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-yellow-500/30 dark:bg-yellow-500/60 rounded-full blur-3xl group-hover:dark:bg-yellow-500/50 transition-all duration-300"
                            ></motion.div> */}
                            
                            {/* Main Logo with hover effect */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative z-10 cursor-pointer"
                            >
                                <motion.img
                                    src="/Logo.png"
                                    alt="VoIP Logo"
                                    className="w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-2xl"
                                    animate={{ 
                                        y: [0, -3, 0]
                                    }}
                                    transition={{ 
                                        duration: 4, 
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.div>
                            
                            {/* Orbiting particles */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ 
                                        rotate: 360,
                                    }}
                                    transition={{ 
                                        duration: 10 + i * 5, 
                                        repeat: Infinity, 
                                        ease: "linear",
                                        delay: i * 2
                                    }}
                                    className="absolute inset-0"
                                    style={{
                                        width: `${300 + i * 40}px`,
                                        height: `${300 + i * 40}px`,
                                        left: '50%',
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    <div 
                                        className={`absolute top-0 left-1/2 w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full -translate-x-1/2 shadow-lg shadow-yellow-500/50 transition-opacity duration-300 ${
                                            i === 0 ? 'opacity-60 group-hover:opacity-100' : 
                                            i === 1 ? 'opacity-45 group-hover:opacity-90' : 
                                            'opacity-30 group-hover:opacity-75'
                                        }`}
                                    ></div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 md:px-10 bg-white/50 dark:bg-black/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-yellow-400 mb-4">
                            Why Choose Us?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-yellow-100/70 max-w-2xl mx-auto">
                            Cutting-edge technology meets seamless user experience
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-12 h-12 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                ),
                                title: "End-to-End Encryption",
                                description: "Your calls are secured with military-grade encryption, ensuring complete privacy."
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                ),
                                title: "Lightning Fast",
                                description: "Experience ultra-low latency with our optimized global network infrastructure."
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                                title: "Global Reach",
                                description: "Connect with anyone, anywhere in the world with crystal-clear quality."
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                ),
                                title: "HD Voice Quality",
                                description: "Enjoy superior audio quality with our advanced codec technology."
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                ),
                                title: "Cross-Platform",
                                description: "Access from any device - desktop, mobile, or tablet seamlessly."
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                ),
                                title: "Easy to Use",
                                description: "Intuitive interface designed for everyone, no technical knowledge required."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="card p-8 hover:scale-105 transition-transform duration-300"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-black dark:text-yellow-400 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-yellow-100/70">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 md:px-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto card p-12 text-center relative overflow-hidden"
                >
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-radial from-yellow-500/20 to-transparent"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-yellow-400 mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-yellow-100/70 mb-8 max-w-2xl mx-auto">
                            Join thousands of users who trust our platform for their communication needs.
                        </p>
                        <button 
                            onClick={handleGetStarted}
                            className="btn-primary text-xl px-10 py-4 group"
                        >
                            Start Calling Now
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 ml-2 inline-block group-hover:translate-x-1 transition-transform"
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
                    </div>
                </motion.div>
            </section>
        </div>
    )
}

export default VoipCalling
