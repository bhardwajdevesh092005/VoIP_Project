import { useState } from 'react'

const KeyPad = () => {
    const [dialedNumber, setDialedNumber] = useState('')
    const [isRinging, setIsRinging] = useState(false)

    const handleKeyPress = (key) => {
        if (dialedNumber.length < 15) {
            setDialedNumber(prev => prev + key)
        }
    }

    const handleCall = () => {
        if (dialedNumber.length > 0) {
            setIsRinging(true)
            setTimeout(() => {
                setIsRinging(false)
                alert(`Calling ${dialedNumber}... 📞\n\nJust kidding! This is a demo app. 😄`)
            }, 1500)
        }
    }

    const handleClear = () => {
        if (dialedNumber.length > 0) {
            setDialedNumber(prev => prev.slice(0, -1))
        }
    }

    const handleClearAll = () => {
        setDialedNumber('')
    }

    return (
        <div className="card p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-shadow duration-300 max-w-sm">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Dial Pad
                </h3>
                <div className="h-14 flex items-center justify-center bg-gray-100 dark:bg-dark-700 rounded-xl px-4 text-2xl font-mono text-gray-700 dark:text-gray-200 relative overflow-hidden">
                    {dialedNumber || (
                        <span className="text-gray-400 dark:text-gray-500 text-lg">
                            Enter number...
                        </span>
                    )}
                    {isRinging && (
                        <span className="absolute inset-0 flex items-center justify-center bg-primary-500/20 animate-pulse">
                            📞 Calling...
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-6">
                {[
                    { key: '1', sub: '' },
                    { key: '2', sub: 'ABC' },
                    { key: '3', sub: 'DEF' },
                    { key: '4', sub: 'GHI' },
                    { key: '5', sub: 'JKL' },
                    { key: '6', sub: 'MNO' },
                    { key: '7', sub: 'PQRS' },
                    { key: '8', sub: 'TUV' },
                    { key: '9', sub: 'WXYZ' },
                    { key: '*', sub: '' },
                    { key: '0', sub: '+' },
                    { key: '#', sub: '' },
                ].map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleKeyPress(item.key)}
                        className="bg-gray-100 dark:bg-dark-700 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-2xl w-16 h-16 md:w-18 md:h-18 flex flex-col items-center justify-center text-xl font-semibold text-gray-800 dark:text-gray-100 shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200 border border-gray-200 dark:border-dark-600"
                    >
                        <span>{item.key}</span>
                        {item.sub && (
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                {item.sub}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex justify-center items-center space-x-3">
                <button
                    onClick={handleClear}
                    disabled={dialedNumber.length === 0}
                    className="bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    title="Backspace"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                    </svg>
                </button>

                <button
                    onClick={handleCall}
                    disabled={dialedNumber.length === 0 || isRinging}
                    className={`${isRinging ? 'bg-yellow-500 animate-pulse' : 'bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600'} text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Call"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </button>

                <button
                    onClick={handleClearAll}
                    disabled={dialedNumber.length === 0}
                    className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    title="Clear All"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {dialedNumber === '911' && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-center animate-pulse">
                    <p className="text-red-700 dark:text-red-300 text-sm font-semibold">
                        🚨 This is just a demo! For real emergencies, use your actual phone!
                    </p>
                </div>
            )}

            {dialedNumber === '8675309' && (
                <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-xl text-center">
                    <p className="text-purple-700 dark:text-purple-300 text-sm font-semibold">
                        🎵 Jenny, I have got your number! 🎵
                    </p>
                </div>
            )}

            {dialedNumber === '42' && (
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-xl text-center">
                    <p className="text-blue-700 dark:text-blue-300 text-sm font-semibold">
                        🤖 The Answer to Life, the Universe, and Everything!
                    </p>
                </div>
            )}

            {dialedNumber === '1234567890' && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl text-center">
                    <p className="text-green-700 dark:text-green-300 text-sm font-semibold">
                        🎉 Wow, you typed all the numbers in order! Nice!
                    </p>
                </div>
            )}

            {dialedNumber === '123456' && (
                <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-xl text-center">
                    <p className="text-orange-700 dark:text-orange-300 text-sm font-semibold">
                        🔐 That is the kind of password an idiot would have on his luggage!
                    </p>
                </div>
            )}
        </div>
    )
}

export default KeyPad
