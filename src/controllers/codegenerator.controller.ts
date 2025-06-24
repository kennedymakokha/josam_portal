
import express from 'express';
import QRCode from 'qrcode';
import { Jimp } from 'jimp';

import cors from 'cors';


import QRCodeModel from '../models/codes.model';
import { App } from '../models/app.model';
interface QrBufferOptions {
    app_name: string;
    color?: string;
    background?: string;
    logoBuffer?: Buffer;
}
const app = express();
app.use(cors());


// Utility to generate QR image buffer with logo & colors


export async function generateLinkQrBuffer({
    app_name,
    color = '#000000',
    background = '#ffffff',
    logoBuffer
}: QrBufferOptions): Promise<Buffer> {


    const qrBuffer = await QRCode.toBuffer(app_name, {
        errorCorrectionLevel: 'H',
        color: { dark: color, light: background }
    });

    const qrImage = await Jimp.fromBuffer(qrBuffer);

    if (logoBuffer) {
        const logo = await Jimp.fromBuffer(logoBuffer);

        const logoWidth = qrImage.bitmap.width * 0.2;
        const aspectRatio = logo.bitmap.height / logo.bitmap.width;
        const logoHeight = Math.round(logoWidth * aspectRatio);

        logo.resize({ w: Math.round(logoWidth), h: logoHeight });

        const x = (qrImage.bitmap.width - logo.bitmap.width) / 2;
        const y = (qrImage.bitmap.height - logo.bitmap.height) / 2;

        qrImage.composite(logo, x, y);
    }

    // Use string 'image/png' instead of Jimp.MIME_PNG
    return qrImage.getBuffer('image/png');
}





const generate_URL_qr_code = async (req: Request | any, res: Response | any) => {
    try {

        const { app_name, color, background } = req.body;

        if (!app_name) return res.status(400).json({ error: 'app_name required' });

        const newQR = await QRCodeModel.create({
            type: 'app_name',
            data: { app_name },
            color,
            background,
            logo: req.file?.buffer,
        });
        const qrData = `${newQR._id}`;

        const pngBuffer = await generateLinkQrBuffer({
            app_name: qrData,
            color,
            background,
            logoBuffer: req.file?.buffer
        });

        const base64 = 'data:image/png;base64,' + pngBuffer.toString('base64');
        await App.findOneAndUpdate({ _id: req.body.id }, { code: base64 }, { new: true, useFindAndModify: false })

        res.json({ qrImage: base64, id: newQR._id });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const download_URL_qr_code = async (req: Request | any, res: Response | any) => {
    try {
        const { app_name, color, background } = req.body;
        if (!app_name) return res.status(400).json({ error: 'app_name required' });

        const pngBuffer = await generateLinkQrBuffer({
            app_name,
            color,
            background,
            logoBuffer: req.file?.buffer
        });
        res.setHeader('Content-Disposition', 'attachment; filename=qr-code.png');
        res.setHeader('Content-Type', 'image/png');
        res.send(pngBuffer);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export {
    generate_URL_qr_code,
    download_URL_qr_code,


}