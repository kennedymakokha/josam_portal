
import { application, Request, Response } from "express";
import { sendTextMessage } from "../utils/sms_sender";
import Sms from "../models/sms.model";





export const sendSms = async (req: Request | any, res: Response | any) => {

    const { message, phone, reciever, ref, application } = req.body;
    try {
        let response = await sendTextMessage(message, phone, reciever, ref, application)

        if (response.success) {
            res.status(200).json(response.data);
            return
        }
        else {
            res.status(400).json(response.data);
            return
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            data: error
        });
        return
    }

}

export const Get = async (req: Request | any, res: Response | any) => {

    try {
        const { page = 1, limit = 10, application } = req.query;
        const sms: any = await Sms.find({ deletedAt: null, application: application }).skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
        const total = await Sms.countDocuments();
        res.status(201).json(
            {
                sms, page: parseInt(page),
                totalPages: Math.ceil(total / limit)
            }
        );
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, message: "Server error", error });
        return;

    }
};