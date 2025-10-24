import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

class MongoDbService{
    constructor(){
        this.uri = process.env.MONGODB_URL;
        this.db_name = process.env.MONGO_DB_NAME;
    }
    async connectMongo(){
        try {
            await mongoose.connect(this.uri,{
                dbName:this.db_name,
            })
            console.log("Connected to the mongo database");
        } catch (error) {
            console.log("Unale to connect to the mongo db due to:",error.message);
        }
    }
    async disconnectMongoose(){
        try {
            await mongoose.disconnect();
            console.log("Disconnected from the mongoose database")
        } catch (error) {
            console.log("Could not disconnect from the mongoose database due to:",error.message);
        }
    }
}

export default MongoDbService