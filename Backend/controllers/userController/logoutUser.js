import { asyncHandler } from '../../Utils/asyncHandler.js'
import { ApiResponse } from '../../Utils/apiResponse.js'
import database from '../../db/dbService.js'

/**
 * Logout user
 * Clears refresh token from database and cookies
 * @route POST /api/v1/user/logout
 * @access Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user.userID

    // Clear refresh token from database
    await database.prismaService.prismaClientObject.user.update({
        where: { userID: userId },                                                                                                                                                                                                                      
        data: { refreshToken: null }
    })

    // Clear cookies
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }

    return res
        .status(200)
        .clearCookie('accessToken', cookieOptions)
        .clearCookie('refreshToken', cookieOptions)
        .json(
            new ApiResponse(200, null, 'Logged out successfully')
        )
})
