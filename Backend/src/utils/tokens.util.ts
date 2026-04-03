import jwt from "jsonwebtoken";

const createTokens = (userId: string) => {
    const accessToken = jwt.sign(
        { _id: userId },
        process.env.ACCESS_TOKEN_SECRET || "" as jwt.Secret,
        {
            expiresIn: (process.env.ACCESS_TOKEN_EXPIRY as string) || "15m",
        } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
        {
            expiresIn: (process.env.REFRESH_TOKEN_EXPIRY as string) || "7d"
        } as jwt.SignOptions
    );

    return { accessToken, refreshToken };
}

export default createTokens;