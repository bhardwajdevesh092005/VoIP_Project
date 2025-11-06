import jwt from 'jsonwebtoken';

export const generateAccessAndRefeshTokens = (id,email)=>{
    const refreshToken = jwt.sign({
        _id: id,
        email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
    const accessToken = jwt.sign({
        _id: id,
        email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
    return {accessToken,refreshToken};
}
