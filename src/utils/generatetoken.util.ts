import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface UserPayload {
    _id: string;
    username: string;
    role: string;
    name: string;
}

const generateTokens = (user: UserPayload, accessExpiry: string) => {
    const jwtSecret = process.env.JWT_SECRET || "your_secret_key";
    const refreshSecret = process.env.REFRESH_SECRET || "my_secret_key";

    const accessToken = jwt.sign(
        {
            userId: user._id,
            username: user.username,
            role: user.role,
            name: user.name,
        },
        jwtSecret,
        { expiresIn: accessExpiry }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        refreshSecret,
        { expiresIn: "7d" } // You could make this dynamic too if needed
    );

    return { accessToken, refreshToken };
};

export default generateTokens;
