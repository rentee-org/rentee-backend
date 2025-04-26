export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
}