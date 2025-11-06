import PrismaService from '../prisma/index.js'
import MongoDbService from '../mongo/index.js'
import RedisService from '../redis/index.js'
class dbService{
    constructor(){
        this.prismaService = new PrismaService();
        this.mongoService = new MongoDbService();
        this.redisService = new RedisService();
        this.connectDb();
    }
    async connectDb(){
        await this.prismaService.connectPostgres();
        await this.mongoService.connectMongo();
        await this.redisService.connectRedis();
    }
    async disConnectDb(){
        await this.prismaService.disconnectPostgres();
        await this.mongoService.disconnectMongoose();
        await this.redisService.disconnectRedis();
    }
}
const database = new dbService();
export default database