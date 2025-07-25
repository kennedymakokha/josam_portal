

import Sms from '../models/sms.model';
import { ISms } from '../types';

export const sendTextMessage = async (message: string, phone: string, reciever: string, ref: string, application: string) => {
    let sender_id = "Champ_Int"
    let api_key = "9b41859b01914a75a2a899b9f61dec93"
    let dataIn = {
        api_key,
        sender_id,
        message,
        phone
    }
    try {
        const response: any = await fetch('https://sms.blessedtexts.com/api/sms/v1/sendsms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataIn)
        });

        const data = await response.json();
        "Data from api ...  "
        let dataFrmAPI = [
            {
                "_id": "6870e0bbff00cacd7fd5891b",
                "application": "smarttenant",
                "message": "lets  try",
                "phone": "0720141534",
                "status_code": "1000",
                "message_id": "6870e0bd16b371012188822",
                "status_desc": "Success",
                "ref": "info",
                "timestamp": "2025-07-11T10:00:27.764Z",
                "__v": 0
            }
        ]
        let body: ISms | any = {
            reciever: reciever,
            message: dataIn.message,
            message_id: "",
            status_code: "",
            status_desc: "",
            ref: ref,
            phone: phone


        }
        if (Array.isArray(data) && data[0].status_code === "1000") {
            body.status_code = data[0].status_code
            body.status_desc = data[0].status_desc
            body.message_id = data[0].message_id

            body.application = application
            const message = new Sms(body);
            await message.save();
            return {
                success: true,
                data
            }
        }
        else {
            body.status_code = data.status_code
            body.status_desc = data.status_desc

            const message = new Sms(body);
            await message.save();
            return {
                success: false,
                data
            }
        }

    } catch (error: any) {
        console.error('Error:', error);
        return {
            success: false,
            // error: error.message
        }

    }
}



export const Balance = async () => {
    let sender_id = "Champ_Int"
    let api_key = "9b41859b01914a75a2a899b9f61dec93"
    let dataIn = {
        api_key,
        sender_id,

    }
    try {
        const response: any = await fetch('https://sms.blessedtexts.com/api/sms/v1/credit-balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataIn)
        });

        const data = await response.json();
        return data

    } catch (error: any) {
        console.error('Error:', error);
        return {
            success: false,
            // error: error.message
        }

    }
}