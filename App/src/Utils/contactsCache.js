// Contacts cache utility for localStorage
const CACHE_KEY = 'voip_contacts_cache'

export const contactsCache = {
    // Save contacts to localStorage
    saveContacts(contacts, currentUserId) {
        try {
            const contactsMap = {}
            
            contacts.forEach(contactRequest => {
                // Determine which user is the contact (not the current user)
                const contactInfo = contactRequest.senderId === currentUserId 
                    ? contactRequest.toUser 
                    : contactRequest.fromUser
                
                if (contactInfo && contactInfo.userID) {
                    contactsMap[contactInfo.userID] = {
                        userID: contactInfo.userID,
                        fullName: contactInfo.fullName,
                        email: contactInfo.email,
                        profilePicture: contactInfo.profilePicture,
                        cachedAt: Date.now()
                    }
                }
            })
            
            localStorage.setItem(CACHE_KEY, JSON.stringify(contactsMap))
            console.log('Contacts cached:', Object.keys(contactsMap).length)
        } catch (error) {
            console.error('Error saving contacts to cache:', error)
        }
    },

    // Get contact info by userID
    getContact(userID) {
        try {
            const cached = localStorage.getItem(CACHE_KEY)
            if (!cached) return null
            
            const contactsMap = JSON.parse(cached)
            return contactsMap[userID] || null
        } catch (error) {
            console.error('Error reading from contacts cache:', error)
            return null
        }
    },

    // Get all cached contacts
    getAllContacts() {
        try {
            const cached = localStorage.getItem(CACHE_KEY)
            if (!cached) return {}
            
            return JSON.parse(cached)
        } catch (error) {
            console.error('Error reading contacts cache:', error)
            return {}
        }
    },

    // Clear the cache
    clearCache() {
        try {
            localStorage.removeItem(CACHE_KEY)
            console.log('Contacts cache cleared')
        } catch (error) {
            console.error('Error clearing contacts cache:', error)
        }
    }
}
