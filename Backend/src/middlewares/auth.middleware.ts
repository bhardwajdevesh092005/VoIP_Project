import jsonwebtoken from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';
import { type User } from '../generated/prisma/client.js';
import db from '../db/index.js';
declare global {
    namespace Express {
        interface Request {
            user?: User | null;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const authCookie = req.cookies?.accessToken;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        return res.sendStatus(500); // Internal Server Error if secret is missing
    }
    jsonwebtoken.verify(token, secret, async (err, payload) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        let userId: number | undefined;
        if (typeof payload === 'object' && payload !== null && 'id' in payload) {
            userId = (payload as { id: number }).id;
        }
        if (!userId) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = await db.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        next();
    });
}
