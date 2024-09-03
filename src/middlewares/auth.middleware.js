import userSchema from "../models/user.schema.js";
import JWT from 'jsonwebtoken';
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../services/CustomError.js";
import config from "../config/index.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {

  let token;
  if (req.cookie?.token || (req.headers?.authorization && req.headers?.authorization.startsWith('Bearer'))) {
    token = req.cookie?.token || req.headers?.authorization?.split(' ')[1]
  }
  if (!token) {
    throw new CustomError('Not authorized to access the resource', 401)
  }
  try {
    const { _id, role } = JWT.verify(token, config.JWT_SECRET)
    req.user = await userSchema.findById( _id ,"name email role") //saving the user in the request
  } catch (err) {
    console.log(err)
    throw new CustomError('Not authorize to access the resource', 401)
  }
  next()
})


export const authorize = (...requiredRoles) => asyncHandler(async(req,res,next)=>{
  if(!requiredRoles.includes(req.user.role)){
    throw new CustomError("you are not authorize to access the resource")
  }
  next()
})
