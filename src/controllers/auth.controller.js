import userSchema from '../models/user.schema.js';
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../services/CustomError.js'
import cookieOptions from '../utils/cookieOptions.js'


/******************************************************
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @returns User Object
 ******************************************************/
export const signup = asyncHandler(async (req, res) => {
  // get data from user
  const { name, email, password } = req.body;

  // validation 1(FrontEnd) : checking if the fields are empty
  if (!name || !email || !password) {
    throw new CustomError('Missing required fields', 400)
  }
  // validation 2(FrontEnd) : checking the lengths of the fields
  if (name.length < 4 || password.length < 8) {
    throw new CustomError('Invalid length for fields. Name must be at least 4 characters long and password must be at least 8 characters long.', 400);
  }
  // validation 3(BackEnd) :
  const existingUser = await userSchema.findOne({ email })
  if (existingUser) {
    throw new CustomError('user already exists', 400)
  }
  // create a new user in the DB
  const user = await userSchema.create({ name, email, password })
  user.password = undefined // mongoose return the select false value at the time of creation
  // create a jwt token
  const token = user.getJWTtoken();
  // store the token in the user cookie
  res.cookie('token', token, cookieOptions)

  res.status(200).json({
    success: true,
    token,
    user
  })
})

/*********************************************************
 * @LOGIN
 * @route http://localhost:5000/api/auth/login
 * @description User Login Controller for signing in the user
 * @returns User Object
 *********************************************************/
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError('Required fields are missing', 400)
  }
  const user = await userSchema.findOne({ email }).select('+password')
  if (!user) {
    throw new CustomError("Invalid credentials", 400)
  }
  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched) {
    throw new CustomError("Invalid credentials", 400)
  }
  const token = user.getJWTtoken()
  user.password = undefined
  res.cookie("token", token, cookieOptions)
  return res.status(200).json({
    success: true,
    token,
    user
  })
})

/**********************************************************
 * @LOGOUT
 * @route http://localhost:5000/api/auth/logout
 * @description User Logout Controller for logging out the user
 * @description Removes token from cookies
 * @returns Success Message with "Logged Out"
 **********************************************************/

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true
  })

  res.status(200).json({
      success: true,
      message: 'Logged Out'
  })
})

/**********************************************************
 * @GET_PROFILE
 * @route http://localhost:5000/api/auth/profile
 * @description check token in cookies, if present then returns user details
 * @returns Logged In User Details
 **********************************************************/
export const getProfile = asyncHandler(async(req,res)=>{

    const {user} = req;
    if(!user){
      throw new CustomError('Please login to get the resource',401)
    }
    res.status(200).json({
      success : true,
      user,
    })
})


export const forgotPassword = asyncHandler(async (req, res) => {
  const {email} = req.body
  //no email
  const user = await userSchema.findOne({email})

  if (!user) {
      throw new CustomError("User not found", 404)
  }

  const resetToken = user.generateForgotPasswordToken()

  await user.save({validateBeforeSave: false})


  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/password/reset/${resetToken}`

  const message = `Your password reset token is as follows \n\n ${resetUrl} \n\n if this was not requested by you, please ignore.`

  try {
      await mailHelper({
          email: user.email,
          subject: "Password reset mail",
          message
      })
  } catch (error) {
      user.forgotPasswordToken = undefined
      user.forgotPasswordExpiry = undefined

      await user.save({validateBeforeSave: false})

      throw new CustomError(error.message || "Email could not be sent", 500)
  }

})


export const resetPassword = asyncHandler(async (req, res) => {
  const {token: resetToken} = req.params
  const {password, confirmPassword} = req.body

  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex")

  const user = await userSchema.findOne({
      forgotPasswordToken: resetPasswordToken,
      forgotPasswordExpiry: { $gt : Date.now() }
  })

  if (!user) {
      throw new CustomError( "password reset token in invalid or expired", 400)
  }

  if (password !== confirmPassword) {
      throw new CustomError("password does not match", 400)
  }

  user.password = password;
  user.forgotPasswordToken = undefined
  user.forgotPasswordExpiry = undefined

  await user.save()

  const token = user.getJWTtoken()
  res.cookie("token", token, cookieOptions)

  res.status(200).json({
      success: true,
      user,
      token
  })
})
