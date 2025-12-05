import { Router } from 'express'
import { getCallHistory } from '../controllers/callController/index.js'
import { verifyJwt } from '../middlewares/auth.middleware.js'

const router = Router()

/**
 * @route   GET /api/v1/calls/history
 * @desc    Get call history for authenticated user
 * @access  Private
 */
router.get('/history', verifyJwt, getCallHistory)

export default router
