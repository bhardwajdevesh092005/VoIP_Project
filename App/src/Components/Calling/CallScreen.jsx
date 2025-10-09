import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import UserCard from './UserCard'

const CallScreen = () => {
    const [otherUserJoined, setOtherUserJoined] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setOtherUserJoined(true)
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    const user = {
        name: 'You',
        phone: '+918368424747',
        img: '/profile.jpg',
    }

    const otherUser = {
        name: 'John Doe',
        phone: '+919876543210',
        img: '/other-profile.jpg',
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tr from-blue-50 to-white">
            <h1 className="text-2xl font-bold text-gray-800 mb-10">Calling...</h1>

            <div className="flex gap-10">
                <UserCard
                    img={otherUser.img}
                    name={otherUser.name}
                    phone={otherUser.phone}
                    status={!otherUserJoined ? 'Ringing...' : 'Connected'}
                    statusColor={!otherUserJoined ? 'pulse' : 'text-gray-500'}
                />
                {otherUserJoined && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <UserCard
                            img={user.img}
                            name={user.name}
                            phone={otherUser.phone}
                            status="Connected"
                            statusColor="text-green-500"
                        />
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default CallScreen
