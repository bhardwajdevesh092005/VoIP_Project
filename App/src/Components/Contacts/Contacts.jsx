import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import ContactCard from './Contact_Card'
import ContactRequestCard from './Contact_Request_Card'
import { useSelector } from 'react-redux'

const Contacts = () => {
    const navigate = useNavigate()
    const isAuthenticated = useSelector(state => state.user.isAuth)
    const contacts = [
        { name: 'Devesh Bhardwaj', phone: '+918368424747' },
        { name: 'John Doe', phone: '+919876543210' },
        { name: 'Jane Smith', phone: '+919876543211' },
        { name: 'Rahul Sharma', phone: '+919876543212' },
        { name: 'Priya Patel', phone: '+919876543213' },
    ]
    const contactRequests = [
        { name: 'Aman Verma', phone: '+918765432198' },
        { name: 'Priya Sharma', phone: '+919887766554' },
    ]

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate])

    const handleCall = name => {
        console.log('Trying to call:', name)
    }

    return (
        <div className="max-w-5xl mx-auto mt-6 md:mt-10 px-4 pb-10">
            {/* Your Contacts Section */}
            <div className="card p-6 md:p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-7 h-7 text-primary-600 dark:text-primary-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 110-8 4 4 0 010 8z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Your Contacts
                        </h1>
                    </div>
                    <button 
                        className="btn-primary text-sm md:text-base"
                        onClick={() => navigate('/contacts/add')}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 inline-block mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Contact
                    </button>
                </div>

                {contacts && contacts.length > 0 ? (
                    <ul className="space-y-3">
                        {contacts.map((contact, index) => (
                            <ContactCard
                                key={index}
                                name={contact.name}
                                phone={contact.phone}
                                onCall={() => handleCall(contact.name)}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-12 text-gray-500 dark:text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-16 h-16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 110-8 4 4 0 010 8z"
                            />
                        </svg>
                        <p>No contacts found.</p>
                    </div>
                )}
            </div>

            {/* Contact Requests Section */}
            <div className="card p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-7 h-7 text-secondary-600 dark:text-secondary-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Contact Requests
                    </h3>
                </div>

                <ul className="space-y-3">
                    {contactRequests.map((req, idx) => (
                        <ContactRequestCard
                            key={idx}
                            name={req.name}
                            phone={req.phone}
                            onAccept={() => console.log(`Accepted request from ${req.name}`)}
                            onReject={() => console.log(`Rejected request from ${req.name}`)}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Contacts
