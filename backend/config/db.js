import mongoose from "mongoose";

const connectDB = async() =>{
try{
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Mongo DB connected : ${conn.connection.host}`);
}catch(err){
    console.log(`Error Connecting to DB : ${err.message}`);
    process.exit(1);
}
};
export default connectDB;
