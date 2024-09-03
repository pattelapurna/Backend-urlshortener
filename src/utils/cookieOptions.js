const cookieOptions = {
  expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly : true,
  secure: true
}

export default cookieOptions
