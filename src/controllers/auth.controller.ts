import { Request, Response } from "express";
import { User } from "../models/user.model";

import { Format_phone_number } from "../utils/simplefunctions.util";
import jwt from "jsonwebtoken";
// import jwt_decode from "jwt-decode";
// import { jwtDecode } from "jwt-decode";
import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import generateTokens from "../utils/generatetoken.util";
import { parse } from "cookie";
// import jwtDecode from "jwt-decode";  // Fixed import here
interface DecodedToken {
    exp: number;
    iat: number;
    // other custom claims...
}
import { MakeActivationCode } from "../utils/generate_activation.util";
import { isNumber } from "../utils/isEmpty";
import { subscribeToRoom } from "../utils/sendNotifications";

// User Registration
export const register = async (req: Request, res: Response) => {
    try {
        const { name, password, phone_number, email } = req.body;

        let phone = await Format_phone_number(phone_number); // format the phone number
        const userExists: any = await User.findOne({
            $or: [
                { email: email },
                { phone_number: phone }
            ],
        });

        if (userExists) {
            res.status(400).json("User already exists");
            return;
        }

        let activationcode = MakeActivationCode(4);


        const userData = {
            name,
            email,
            phone_number: phone,
            password,
            activationCode: activationcode,
        };

        const user: any = new User(userData);
        const newUser = await user.save();

        res.status(201).json({ ok: true, message: "User registered successfully", newUser });
        return;

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
        return;
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { newPassword, phone_number } = req.body;
        let phone = await Format_phone_number(phone_number);
        const user: any = await User.findOne({ phone_number: phone });
        if (!user) {
            res.status(400).json("User not found");
            return;
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
        return;
    }
};
export const updateKey = async (req: Request | any, res: Response | any) => {
    try {

        const user: any = await User.findOne({ _id: req.user.userId });
        if (!user) {
            res.status(400).json("User not found");
            return;
        }
        user.secret_key = req.body.secret_key
        await user.save();

        res.status(200).json({ success: true, message: "Key added successfully" });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
        return;
    }
};

// Other handlers unchanged except for minor fixes...

export const login = async (req: Request, res: Response) => {

    try {

        if (req.method !== "POST") {
            res.status(405).json("Method Not Allowed");
            return;
        }
        const { identifier, password, fcm_token } = req.body;
        let phone
        if (isNumber(identifier)) {
            phone = await Format_phone_number(identifier);
        }
        // format the phone number

        const userExists: any = await User.findOne({
            $or: [
                { email: identifier },
                { phone_number: phone }
            ]
        }).select("phone_number name role email +password activated fcm_token");

        if (!userExists) {
            res.status(400).json("User Not Found");
            return;
        }

        if (!(await bcrypt.compare(password, userExists.password))) {
            res.status(401).json("Invalid credentials");
            return;
        } else {


            const existingToken = userExists.fcm_token.find(
                (token: string) => token === req.body.fcm_token,
            );
            if (fcm_token && !existingToken) {

                userExists.fcm_token.push(fcm_token)
                // Subscribe to room (optional logic)
                subscribeToRoom({ roomId: "test_room", tokens: [fcm_token] });
            }
            userExists.save()
            // Generate tokens
            const { accessToken, refreshToken } = generateTokens(userExists, "2hrs");


            res.status(200).json({ ok: true, message: "Logged in", token: accessToken, user: userExists });
            return;
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" });
    }
};

// session check
export const session_Check = async (req: Request | any, res: Response): Promise<void> => {
    try {

        const user: any = await User.findById(req.user.userId)
        res.status(200).json(user);
        return
    } catch (error) {
        res.status(401).json({ ok: "false", message: "Invalid token" });
    }
}

export const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized" })
        return
    };
    jwt.verify(refreshToken, process.env.REFRESH_SECRET ? process.env.REFRESH_SECRET : "my_secret_key", (err: any, decoded: any) => {
        if (err) {
            res.status(403).json({ message: "Forbidden" })
            return
        };
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET ? process.env.JWT_SECRET : "your_secret_key",
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
        return
    });
};
export const logout = async (req: Request | any, res: Response): Promise<void> => {
    console.log(req)
    const user: any = await User.findById(req.user.userId);
    if (!user) {
        res.status(404).json({ message: 'User not found !' });
        return;
    }
    if (req.body.fcm_token && user.fcm_token) {
        // Remove the specific token
        user.fcm_token.pull(req.body.fcm_token);
        await user.save();

        // Unsubscribe the token from all user-specific topics
        // await unsubscribeUserFromTopics(user, req.body.fcmToken);
        // console.log(`Token ${req.body.fcmToken} removed and unsubscribed.`);
    }
    res.status(200).json({ message: "Logged out" });
    return
};


