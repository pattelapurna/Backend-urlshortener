import { Router } from "express";
import authRoutes from './auth.routes.js'
// import testRoutes from './test.routes.js'

const router = Router()

router.use('/auth',authRoutes)
// router.use('/test',testRoutes)

export default router
