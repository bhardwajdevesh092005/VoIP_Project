import prisma from "./prisma.js";

class Database {
    prisma: typeof prisma;
    constructor() {
        this.prisma = prisma;
    }
    async connect() {
        try {
            await prisma.$connect();
            console.log("Database connected");
        } catch (error) {
            console.error("Database connection error:", error);
        }
    }
    async disconnect() {
        try {
            await prisma.$disconnect();
            console.log("Database disconnected");
        } catch (error) {
            console.error("Database disconnection error:", error);
        }
    }
}

const db = new Database();
export default db;