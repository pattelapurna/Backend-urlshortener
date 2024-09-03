import {Router} from 'express'

const router = Router()

router.get('/one',(req,res)=>{
  res.send('I am a waste')
})

export default router
