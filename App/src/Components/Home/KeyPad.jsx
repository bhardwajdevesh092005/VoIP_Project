const KeyPad = () => {
    return (
        <div className="relative -right-80 top-20  bg-white border-2 border-gray-200 rounded-xl p-10 shadow-lg">
            {/* <p className='text-center font-semibold text-gray-800 mb-4'>Calling...</p> */}

            <div className="grid grid-cols-3 gap-4 text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 rounded-full w-14 h-14 flex items-center justify-center text-xl font-medium text-gray-700"
                    >
                        {key}
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-center">
                <button className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    📞
                </button>
            </div>
        </div>
    )
}
export default KeyPad
