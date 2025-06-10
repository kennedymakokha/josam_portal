
import { Request, Response } from "express";

import { Service } from "../models/Service.model";

export const Create = async (req: Request | any, res: Response): Promise<void> => {
    try {
        // const validationResult = await CustomError(validateProductInput, req.body, res)

        const file = req.file as Express.Multer.File;
        console.log("first")
        if (!file) {
            res.status(400).json({ message: "No image uploaded." });
            return;
        }
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
        console.log(req.protocol)
        // const imageUrl = `https://${req.get("host")}/uploads/${file.filename}`;
        req.body.image = imageUrl; // use `image` instead of `images` for single file
        // req.body.createdBy = req.user.userId;

        const newProduct = new Service(req.body);
        await newProduct.save();

        res.status(201).json({ message: "Product added successfully", newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const Get = async (req: Request | any, res: Response | any) => {

    try {
        let options: any = { deletedAt: null, }
        // if (req.user.role == "admin") {
        //     options = { deletedAt: null, createdBy: req.user.userId }
        // }
        const { page = 1, limit = 10, } = req.query;
        const services: any = await Service.find({ deletedAt: null, }).skip((page - 1) * limit)
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
        res.status(200).json({ message: 'Service deleted successfully', deleted });
    } catch (error) {
        console.error('Deletion Error:', error);
        res.status(500).json({ message: 'Error deleting service', error });
    }
};

