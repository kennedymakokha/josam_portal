
import { Request, Response } from "express";

import { Service } from "../models/Service.model";
import { User } from "../models/user.model";
import { getSocketIo } from "../config/socket";
import { Post } from "../models/post.model";
import { App } from "../models/app.model";



export const Create = async (req: Request | any, res: Response): Promise<void> => {

    try {
        const exists: any = await App.findOne({ createdBy: req.user.userId, app_name: req.body.app_name })
        if (exists) {

            res.status(400).json({ message: "You lready have this app " });
        }
        const file = req.file as Express.Multer.File;
        let imageUrl = ``;
        if (file) {
            imageUrl = `https://form-builder.mtandao.app/api/uploads/${file.filename}`
        }
        req.body.logo = imageUrl
        req.body.createdBy = req.user.userId;

        const newApp: any = new App(req.body);

        await newApp.save();

        // let io = getSocketIo()
        // io.to('admin123').emit('new-service');
        res.status(201).json(newApp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
export const Get = async (req: Request | any, res: Response | any) => {
    try {
        const { name } = req.query
        let exists
        if (name === "all") {
            exists = await App.find({ createdBy: req.user.userId })

        } else {
            exists = await App.findOne({ createdBy: req.user.userId, app_name: name })
        }

        res.status(200).json(exists)
        return
        // let io = getSocketIo()
        // io.broadcast.emit('post_deleted', deleted);

    } catch (error) {
        res.status(404).json(error);

        return

    }
};

export const Update = async (req: Request | any, res: Response | any) => {
    try {
        let updates: any = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        res.status(200).json(updates._id)
        // let io = getSocketIo()
        // io.broadcast.emit('post_edited', updates);
        return
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        return
    }
};
export const Trash = async (req: Request | any, res: Response | any) => {
    try {
        let deleted: any = await Post.findOneAndUpdate({ _id: req.params.id }, { deletedAt: Date() }, { new: true, useFindAndModify: false })
        res.status(200).json(`${deleted.product_name} deleted successfully`)
        // let io = getSocketIo()
        // io.broadcast.emit('post_deleted', deleted);
        return
    } catch (error) {
        res.status(404).json(error);

        return

    }
};


export const Delete = async (req: Request | any, res: Response | any) => {
    try {
        const { id } = req.params;
        const deleted = await Post.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'post not found' });
        }
        // let io = getSocketIo()
        // io.broadcast.emit('post_deleted', deleted);
        res.status(200).json({ message: 'post deleted successfully', deleted });
    } catch (error) {
        console.error('Deletion Error:', error);
        res.status(500).json({ message: 'Error deleting post', error });
    }
};

