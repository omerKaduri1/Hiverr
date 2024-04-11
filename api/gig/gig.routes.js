import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getGigs, getGigById, addGig, updateGig, removeGig } from './gig.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getGigs)
router.get('/:id', getGigById)
router.post('/', requireAuth, addGig)
router.put('/:id', requireAuth, updateGig)
router.delete('/:id', requireAuth, removeGig)
// router.delete('/:id', requireAuth, requireAdmin, removeGig)

// router.post('/:id/msg', requireAuth, addGigMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeGigMsg)

export const gigRoutes = router