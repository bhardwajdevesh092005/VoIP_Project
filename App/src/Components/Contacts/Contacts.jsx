import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import ContactCard from './Contact_Card'
import ContactRequestCard from './Contact_Request_Card'
import { useSelector, useDispatch } from 'react-redux'
import { contactAPI } from '../../Utils/api'
import { toast } from '../../Utils/toast'
import { contactsCache } from '../../Utils/contactsCache'
import { setCallRequest, resetCallState, setCallingUser, setCallStatus } from '../../Redux_Store/Slices/callSlce'

const Contacts = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(state => state.user.isAuth)
    const currentUserId = useSelector(state => state.user.user?.userID)
    const socket = useSelector(state => state.socket.socket)
    const isSocketConnected = useSelector(state => state.socket.connected)
    const hasIncomingCall = useSelector(state => state.call.callRequest)
    const incomingCallFrom = useSelector(state => state.call.callFrom)
    const inCall = useSelector(state => state.call.inCall)
    const callStatus = useSelector(state => state.call.callStatus)
    const [contacts, setContacts] = useState([])
    const [contactRequests, setContactRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [_, setRequestsLoading] = useState(false)

    const fetchContactsAndRequests = async () => {
        try {
            setLoading(true)
            const [contactsRes, requestsRes] = await Promise.all([
                contactAPI.getContacts(),
                contactAPI.getContactRequests('received')
            ])
            
            const fetchedContacts = contactsRes.data.data || []
            setContacts(fetchedContacts)
            setContactRequests(requestsRes.data.data || [])
            console.log(fetchedContacts);
            // Cache contacts in localStorage
            if (fetchedContacts.length > 0 && currentUserId) {
                contactsCache.saveContacts(fetchedContacts, currentUserId)
            }
        } catch (error) {
            console.error('Error fetching contacts:', error)
            toast.error(error.response?.data?.message || 'Failed to load contacts')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        } else {
            fetchContactsAndRequests()
        }
        console.log(socket);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, navigate])

    const handleAcceptRequest = async (requestId) => {
        try {
            setRequestsLoading(true)
            await contactAPI.acceptRequest(requestId, 1)
            toast.success('Contact request accepted!')
            // Refresh the lists
            await fetchContactsAndRequests()
        } catch (error) {
            console.error('Error accepting request:', error)
            toast.error(error.response?.data?.message || 'Failed to accept request')
        } finally {
            setRequestsLoading(false)
        }
    }

    const handleRejectRequest = async (requestId) => {
        try {
            setRequestsLoading(true)
            await contactAPI.acceptRequest(requestId, 2)
            toast.success('Contact request rejected')
            // Refresh the lists
            await fetchContactsAndRequests()
        } catch (error) {
            console.error('Error rejecting request:', error)
            toast.error(error.response?.data?.message || 'Failed to reject request')
        } finally {
            setRequestsLoading(false)
        }
    }

    const handleCall = (contactInfo) => {
        if (!socket || !isSocketConnected) {
            toast.error('Not connected to server. Please refresh the page.')
            return
        }

        if (!contactInfo || !contactInfo.userID) {
            toast.error('Invalid contact information')
            return
        }

        // Check if user is already in a call or has an active call status
        if (inCall || (callStatus !== 'idle' && callStatus !== 'ended')) {
            toast.error('You are already in a call')
            return
        }

        // If there's an incoming call, auto-reject it first
        if (hasIncomingCall && incomingCallFrom?.callerId) {
            console.log('Auto-rejecting incoming call from:', incomingCallFrom.callerId)
            socket.emit('call:response', {
                callerId: incomingCallFrom.callerId,
                accepted: false,
                reason: 'User initiated another call'
            })
            dispatch(setCallRequest(false))
            dispatch(resetCallState())
        }

        console.log('Initiating call to:', contactInfo.fullName)
        
        // Set the user being called in Redux
        dispatch(setCallingUser({
            userID: contactInfo.userID,
            fullName: contactInfo.fullName,
            email: contactInfo.email,
            profilePicture: contactInfo.profilePicture
        }))
        
        // Set call status to calling
        dispatch(setCallStatus('calling'))
        
        // Emit call:initiate event with the callee's ID
        socket.emit('call:initiate', {
            calleeId: contactInfo.userID,
            offer: {} // WebRTC offer will be added later
        })

        // Navigate to call screen
        navigate('/call')
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
                                    onCall={() => handleCall(contactInfo)}
                                    disabled={hasIncomingCall}
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
