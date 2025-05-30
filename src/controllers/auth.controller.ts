import { Request, Response } from "express";
import { User } from "../models/user.model";

import { Format_phone_number } from "../utils/simplefunctions.util";
import jwt from "jsonwebtoken";

import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import generateTokens from "../utils/generatetoken.util";
import { parse } from "cookie";
import jwtDecode from "jwt-decode";  // Fixed import here

import { MakeActivationCode } from "../utils/generate_activation.util";

// User Registration
export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, phone_number } = req.body;

        let phone = await Format_phone_number(phone_number); // format the phone number
        const userExists: any = await User.findOne({
            $or: [
                { username: phone_number },
                { phone_number: phone }
            ],
        });

        if (userExists) {
            res.status(400).json("User already exists");
            return;
        }

        let activationcode = MakeActivationCode(4);

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            ...req.body,
            password: hashedPassword,
            phone_number: phone,
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

// Other handlers unchanged except for minor fixes...

export const login = async (req: Request, res: Response) => {
    try {
        if (req.method !== "POST") {
            res.status(405).json("Method Not Allowed");
            return;
        }
        const { phone_number, password } = req.body;
        let phone = await Format_phone_number(phone_number); // format the phone number

        const userExists: any = await User.findOne({
            $or: [
                { username: phone_number },
                { phone_number: phone }
            ]
        }).select("phone_number username role activated password");

        if (!userExists) {
            res.status(400).json("User Not Found");
            return;
        }

        if (!(await bcrypt.compare(password, userExists.password))) {
            res.status(401).json("Invalid credentials");
            return;
        } else {
            const { accessToken, refreshToken } = generateTokens(userExists, "2hrs");
            const decoded = jwtDecode(accessToken);

            res.setHeader("Set-Cookie", serialize("sessionToken", accessToken, {
                httpOnly: true,  // Recommended to be true for security
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 3600,
            }));

            res.status(200).json({ ok: true, message: "Logged in", token: accessToken, exp: decoded?.exp, user: userExists });
            return;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};




// session check
export const session_Check = async (req: Request, res: Response) => {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.sessionToken;
    if (!token) {
        // NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        res.status(401).json({ message: "Unauthorized" })
        return
    };
    try {

        const user: any = jwt.verify(token, process.env.JWT_SECRET ? process.env.JWT_SECRET : "your_secret_key");
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
export const logout = async (req: Request, res: Response) => {
    res.setHeader("Set-Cookie", serialize("sessionToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Expire immediately
    }));

    res.status(200).json({ message: "Logged out" });
    return
};


