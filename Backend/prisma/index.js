import {PrismaClient} from "@prisma/client";
import dotenv from "dotenv";

class PrismaService {
    constructor() {
        this.prismaClientObject = new PrismaClient({
            log: ["error", "info", "warn"],
        });
    }
    connectPostgres = async () => {
        try {
            await this.prismaClientObject.$connect();
            console.log("Connected to PosgreSQL via Prisma");
        } catch (error) {
            console.log(
                "Unable to connect to SQL database due to:",
                error.message
            );
        }
    };

    disconnectPostgres = async () => {
        try {
            await prismaClientObject.$disconnect();
            console.log("Disconnected from SQL database");
        } catch (error) {
            console.log(
                "Unable to disconnect to the SQL database due to:",
                error.message
            );
        }
    };
}

export default PrismaService;
