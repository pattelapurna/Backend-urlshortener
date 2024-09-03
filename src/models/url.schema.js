import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  url : {
    type :  String,
    required : [true,"Please enter the url for shortening"],
  },
  shortId : {
    type : String,
    required : [true,"I need a short ID"],
    unique : true
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
  },
  clickCount : Number,
  Analytics : [
    {
      geolocation : {
        ip : String,
        network : String,
        city:String,
        region:String,
        country:String,
        latitude:String,
        longitude:String,
        timezone : String,
      },
      systemInfo:{
        userAgent : String,
        platform : String
      },
    }
  ],
},{timestamps:true})

export default mongoose.model('Url',urlSchema)
