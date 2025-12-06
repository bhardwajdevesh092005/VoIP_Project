import { toast } from '../../Utils/toast.js'

export const handleConnectionRejected = (dispatch, navigate) => (data) => {
    console.log('Connection rejected:', data)
    
    // Show error message to user
    toast.error(data.message || 'Connection rejected: You already have an active session in another tab.')
    
    // Optionally navigate to a specific page or show a modal
    // For now, just alert the user about the issue
    setTimeout(() => {
        toast.warning('Please close other tabs and refresh this page to connect.')
    }, 2000)
}
