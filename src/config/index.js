import dotenv from "dotenv";
dotenv.config()

export default {
  SERVER_PORT : process.env.SERVER_PORT,
  MONGO_CONNECTION_URL : process.env.MONGO_CONNECTION_URL,
  JWT_SECRET : process.env.JWT_SECRET,
  JWT_EXPIRY : process.env.JWT_EXPIRY
}
