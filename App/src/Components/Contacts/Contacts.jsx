import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import ContactCard from './Contact_Card'
import ContactRequestCard from './Contact_Request_Card'
import { useSelector } from 'react-redux'
import { contactAPI } from '../../Utils/api'

const Contacts = () => {
    const navigate = useNavigate()
    const isAuthenticated = useSelector(state => state.user.isAuth)
    const currentUserId = useSelector(state => state.user.user?.userID)
    const [contacts, setContacts] = useState([])
    const [contactRequests, setContactRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [_, setRequestsLoading] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        } else {
            fetchContactsAndRequests()
        }
    }, [isAuthenticated, navigate])

    const fetchContactsAndRequests = async () => {
        try {
            setLoading(true)
            const [contactsRes, requestsRes] = await Promise.all([
                contactAPI.getContacts(),
                contactAPI.getContactRequests('received')
            ])
            
            setContacts(contactsRes.data.data || [])
            setContactRequests(requestsRes.data.data || [])
        } catch (error) {
            console.error('Error fetching contacts:', error)
            alert(error.response?.data?.message || 'Failed to load contacts')
        } finally {
            setLoading(false)
        }
    }

    const handleAcceptRequest = async (requestId) => {
        try {
            setRequestsLoading(true)
            await contactAPI.acceptRequest(requestId, 1)
            alert('Contact request accepted!')
            // Refresh the lists
            await fetchContactsAndRequests()
        } catch (error) {
            console.error('Error accepting request:', error)
            alert(error.response?.data?.message || 'Failed to accept request')
        } finally {
            setRequestsLoading(false)
        }
    }

    const handleRejectRequest = async (requestId) => {
        try {
            setRequestsLoading(true)
            await contactAPI.acceptRequest(requestId, 2)
            alert('Contact request rejected')
            // Refresh the lists
            await fetchContactsAndRequests()
        } catch (error) {
            console.error('Error rejecting request:', error)
            alert(error.response?.data?.message || 'Failed to reject request')
        } finally {
            setRequestsLoading(false)
        }
    }

    const handleCall = name => {
        console.log('Trying to call:', name)
    }

    // Helper function to get the contact info (the other user in the request)
    const getContactInfo = (contactRequest) => {
        if (contactRequest.senderId === currentUserId) {
            return contactRequest.toUser
        } else {
            return contactRequest.fromUser
        }
    }

    return (
        <div className="w-1/2 mx-auto mt-6 md:mt-10 px-4 pb-10">
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
                        className="btn-primary text-sm md:text-base px-3"
                        onClick={() => navigate('/my-contacts/add')}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 inline-block mr-0"
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

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                    </div>
                ) : contacts && contacts.length > 0 ? (
                    <ul className="space-y-3">
                        {contacts.map((contactRequest) => {
                            const contactInfo = getContactInfo(contactRequest)
                            return (
                                <ContactCard
                                    key={contactRequest.requestId}
                                    name={contactInfo?.fullName || 'Unknown'}
                                    phone={contactInfo?.email || 'No email'}
                                    onCall={() => handleCall(contactInfo?.fullName)}
                                />
                            )
                        })}
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
                        <button 
                            className="btn-primary text-sm"
                            onClick={() => navigate('/my-contacts/add')}
                        >
                            Add Your First Contact
                        </button>
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
                        {!loading && contactRequests.length > 0 && (
                            <span className="ml-3 text-lg font-normal text-gray-500 dark:text-gray-400">
                                ({contactRequests.length})
                            </span>
                        )}
                    </h3>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                    </div>
                ) : contactRequests.length > 0 ? (
                    <ul className="space-y-3">
                        {contactRequests.map((req) => (
                            <ContactRequestCard
                                key={req.requestId}
                                name={req.fromUser?.fullName || 'Unknown'}
                                phone={req.fromUser?.email || 'No email'}
                                onAccept={() => handleAcceptRequest(req.requestId)}
                                onReject={() => handleRejectRequest(req.requestId)}
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
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                        <p>No pending contact requests.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Contacts
