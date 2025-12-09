import { asyncHandler } from '../../Utils/asyncHandler.js'
import { ApiResponse } from '../../Utils/apiResponse.js'
import { ApiError } from '../../Utils/apiError.js'
import database from '../../db/dbService.js'

/**
 * Get call history for the authenticated user
 * @route GET /api/v1/calls/history
 * @access Private
 */
export const getCallHistory = asyncHandler(async (req, res) => {
    const userId = req.user.userID

    // Fetch call history where user is a participant
    const callHistory = await database.prismaService.prismaClientObject.call.findMany({
        where: {
            users: {
                some: {
                    userID: userId
                }
            }
        },
        include: {
            users: {
                select: {
                    userID: true,
                    fullName: true,
                    email: true,
                    profilePicture: true
                }
            }
        },
        orderBy: {
            startTime: 'desc'
        },
    })

    // Transform the data to include the other participant's details
    const transformedHistory = callHistory.map(call => {
        // Find the other participant (not the current user)
        const otherParticipant = call.users.find(user => user.userID !== userId)
        
        return {
            callId: call.callId,
            participantId: otherParticipant?.userID,
            participantName: otherParticipant?.fullName,
            participantAvatar: otherParticipant?.profilePicture,
            participantEmail: otherParticipant?.email,
            duration: call.duration, // in seconds
            startTime: call.startTime,
            endTime: call.endTime,
            formattedDuration: formatDuration(call.duration),
            formattedTime: formatCallTime(call.startTime)
        }
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            'Call history retrieved successfully',
            transformedHistory,
        )
    )
})

/**
 * Format duration from seconds to human readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "5m 30s", "1h 15m", "45s")
 */
function formatDuration(seconds) {
    if (!seconds || seconds < 0) return '0s'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const parts = []
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

    return parts.join(' ')
}

/**
 * Format call time to human readable format
 * @param {Date} timestamp - Call start timestamp
 * @returns {string} Formatted time (e.g., "Today 10:30 AM", "Yesterday 3:45 PM", "Dec 3, 2:15 PM")
 */
function formatCallTime(timestamp) {
    const callDate = new Date(timestamp)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const callDateOnly = new Date(callDate.getFullYear(), callDate.getMonth(), callDate.getDate())

    // Format time part
    const timeString = callDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })

    // Determine date part
    if (callDateOnly.getTime() === today.getTime()) {
        return `Today ${timeString}`
    } else if (callDateOnly.getTime() === yesterday.getTime()) {
        return `Yesterday ${timeString}`
    } else if (now.getTime() - callDateOnly.getTime() < 7 * 24 * 60 * 60 * 1000) {
        // Within last week - show day name
        const dayName = callDate.toLocaleDateString('en-US', { weekday: 'short' })
        return `${dayName} ${timeString}`
    } else {
        // Older - show date
        const dateString = callDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
        return `${dateString}, ${timeString}`
    }
}
