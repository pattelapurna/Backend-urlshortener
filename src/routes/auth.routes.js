import { Router } from "express";
import { getProfile, login, logout, signup } from "../controllers/auth.controller.js";
import { authorize, isLoggedIn } from "../middlewares/auth.middleware.js";
import AuthRoles from "../utils/authRoles.js";

const router = Router()
router.get('/',(req,res)=>{
  res.send('testing the auth route')
})
router.post('/signup',signup)
router.post('/login',login)
router.get('/logout',logout)
router.get('/profile',isLoggedIn,authorize(AuthRoles.USER),getProfile)

export default router
