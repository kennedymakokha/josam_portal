
import { Request, Response } from "express";

import { Service } from "../models/Service.model";
import { User } from "../models/user.model";
import { getSocketIo } from "../config/socket";
import { sendNotificationToRoom, sendPushNotification } from "../utils/sendNotifications";

export const Create = async (req: Request | any, res: Response): Promise<void> => {

    try {

        const file = req.file as Express.Multer.File;
        let imageUrl = ``;
        if (file) {
            imageUrl = `https://form-builder.mtandao.app/api/uploads/${file.filename}`
        }
        req.body.image = imageUrl
        req.body.createdBy = req.user.userId;
        req.body.ownedBy = req.user.userId;
        const newProduct = new Service(req.body);

        await newProduct.save();
        let io = getSocketIo()
        io.to('admin123').emit('new-service');
        res.status(201).json({ message: "Product added successfully", newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const Get = async (req: Request | any, res: Response | any) => {

    try {
        let options: any = { deletedAt: null, }
        if (req.user.role == "admin") {
            options = { deletedAt: null, ownedBy: req.user.userId }
        } else {
            options = { deletedAt: null, createdBy: req.user.userId }
        }
        const { page = 1, limit = 10, } = req.query;
        const services: any = await Service.find(options).skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
        const total = await Service.countDocuments();
        res.status(201).json(
            {
                services, page: parseInt(page),
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
export const GetBykey = async (req: Request | any, res: Response | any) => {

    try {

        const { page = 1, limit = 10, category, secret_key } = req.query;
        const user: any = await User.findOne({ secret_key: secret_key })
        const services: any = await Service.find({ active: true, deletedAt: null, ownedBy: user._id, category }).skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
        const total = await Service.countDocuments();
        res.status(201).json(
            {
                services, page: parseInt(page),
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


export const Get_one = async (req: Request | any, res: Response | any) => {
    try {
        const { id } = req.params;

        const product_obj: any = await Service.findById(id)
        res.status(201).json(product_obj);
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
        return;

    }
};

export const Update = async (req: Request | any, res: Response | any) => {
    try {

        let updates: any = await Service.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        res.status(200).json(updates._id)
        let io = getSocketIo()
        io.to('admin123').emit('new-service');
        return
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        return
    }
};
export const Trash = async (req: Request | any, res: Response | any) => {
    try {
        let deleted: any = await Service.findOneAndUpdate({ _id: req.params.id }, { deletedAt: Date() }, { new: true, useFindAndModify: false })
        res.status(200).json(`${deleted.product_name} deleted successfully`)
        return
    } catch (error) {
        res.status(404).json(error);

        return

    }
};

export const togglectivate = async (req: Request | any, res: Response | any) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Toggle the active state
        service.active = !service.active;
        const updated = await service.save();
        let io = getSocketIo()
        io.to('admin123').emit('new-service');
        // sendPushNotification({
        //     image: service.image,
        //     title: `${service.category} ${updated.active ? 'activation' : 'deactivation'}`,
        //     token: "fKf6rl9YQzOOHS_b4D3LZD:APA91bES8xmz0Oar5j5ry-SX8-eftNnMqco2wsXEo3_74GQzKpyOFCuH8klozUjl5JB8X9tmW_11SQauXHUQ25pPBCk-MghfQl1rhGTo7NlqHfjOBw32GVA",
        //     text: `${updated.name} is now ${updated.active ? 'active' : 'inactive'}`
        // })
        sendNotificationToRoom({ roomId: "test_room", text: `${updated.name} is now ${updated.active ? 'active' : 'inactive'}` });
        res.status(200).json({
            message: `${updated.name} is now ${updated.active ? 'active' : 'inactive'}`,
            updated,
        });
    } catch (error) {
        console.error('Activation Error:', error);
        res.status(500).json({ message: 'Error toggling active state', error });
    }
};
export const Delete = async (req: Request | any, res: Response | any) => {
    try {
        const { id } = req.params;
        const deleted = await Service.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Service not found' });
        }
        let io = getSocketIo()
        io.to('admin123').emit('new-service');
        res.status(200).json({ message: 'Service deleted successfully', deleted });
    } catch (error) {
        console.error('Deletion Error:', error);
        res.status(500).json({ message: 'Error deleting service', error });
    }
};

