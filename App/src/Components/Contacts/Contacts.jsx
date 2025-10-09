import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useUser } from '../../Utils/Sel_Disp_Handlers/select_handler'
import ContactCard from './Contact_Card'
import ContactRequestCard from './Contact_Request_Card'
const Contacts = () => {
    const navigate = useNavigate()
    const isAuthenticated = useUser().isAuth

    const contacts = [
        { name: 'Devesh Bhardwaj', phone: '+918368424747' },
        { name: 'John Doe', phone: '+919876543210' },
        { name: 'John Doe', phone: '+919876543210' },
        { name: 'John Doe', phone: '+919876543210' },
        { name: 'John Doe', phone: '+919876543210' },
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
        <div>
            <div className="max-w-5xl bg-gradient-to-tr from-blue-50 to-white mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
                {/* Heading with small contacts icon */}
                <div className="flex items-center justify-center space-x-3 mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-indigo-500"
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
                    <h1 className="text-3xl font-bold text-gray-800">Your Contacts</h1>
                </div>

                {contacts && contacts.length > 0 ? (
                    <ul className="space-y-4">
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
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 14h.01M16 10h.01M21 16.5a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p>No contacts found.</p>
                    </div>
                )}
            </div>
            <div className="max-w-5xl bg-gradient-to-tr from-blue-50 to-white mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg mb-4">
                <h3 className="text-2xl text-center font-bold">Contact Requests</h3>
                <ul className="space-y-4">
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
