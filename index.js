import mongoose from "mongoose";
import app from "./src/app.js";
import config from "./src/config/index.js";

(async()=>{
  try {
    await mongoose.connect(config.MONGO_CONNECTION_URL)
    console.log(`DB connected`)

    const onListening = () => {
      console.log(`server listening on port ${config.SERVER_PORT}`);
     }

     app.listen(config.SERVER_PORT, onListening)

     app.on('error',(err)=>{
      console.error('Error',err)
      throw err
    })

  } catch (err) {
    console.error('Error',err);
    throw err
  }
})()
