
import { Request, Response } from "express";

import { Service } from "../models/Service.model";
import { User } from "../models/user.model";
import { getSocketIo } from "../config/socket";
import { Post } from "../models/post.model";
import { App } from "../models/app.model";
import { registerUser } from "./auth.controller";



export const Create = async (req: Request | any, res: Response): Promise<void> => {
    const timestamp = Date.now();

    // Convert to string and take the last 9 digits

    const nineDigit = timestamp.toString().slice(-9);
    try {
        const exists: any = await App.findOne({ app_name: req.body.app_name })
        if (exists) {
            res.status(400).json(`App with name ${req.body.app_name} already exists`);
            return
        }
        const file = req.file as Express.Multer.File;
        let imageUrl = ``;
        if (file) {
            imageUrl = `${process.env.IMAGE_URL}/api/uploads/${file.filename}`
        }
        req.body.logo = imageUrl
        req.body.createdBy = req.user.userId;
        req.body.scratch_no = timestamp.toString().slice(-4);
        if (await App.findOne({ scratch_no: req.body.app_name })) {
            req.body.scratch_no = timestamp.toString().slice(-4);
        }
        const newApp: any = new App(req.body);
        await newApp.save();
        await registerUser({
            name: req.body.app_name,
            email: req.body.app_name.replace(/\s+/g, '').toLowerCase() + '@mtandao.app',
            phone_number: `0${nineDigit}`,
            role: 'admin',
            password: req.body.app_name.replace(/\s+/g, '').toLowerCase() + '123',
            app_id: newApp._id,
        });
        newApp.users.push(req.user.userId);
        await newApp.save(); // persist changes
        // let io = getSocketIo()
        // io.to('admin123').emit('new-service');
        res.status(201).json(newApp);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const Get = async (req: Request | any, res: Response | any) => {
    try {
        const { id } = req.query
        const user: any = await User.findById(req.user.userId);
        let exists
        if (user.role === 'superadmin') {
            exists = await App.find()
        } else {

            exists = await App.find({ createdBy: req.user.userId })
        }

      
        res.status(200).json(exists)
        return
        // let io = getSocketIo()
        // io.broadcast.emit('post_deleted', deleted);

    } catch (error) {
        res.status(404).json(error);
        console.log(error)
        return

    }
};
export const Get_one = async (req: Request | any, res: Response | any) => {
    try {
        const { id } = req.params
    
        if (!id) {
            res.status(400).json({ message: "App ID is required" });
            return;
        }
        let exists: any;
        if (id.length === 24) {
            exists = await App.findById(id).select('-code')
        } else {
            exists = await App.findOne({ scratch_no: id }).select('-code')
        }
        // const exists = await App.findOne({
        //     $or: [
        //         { _id: id },
        //         { scratch_no: id }
        //     ]
        // }).select('-code')
        if (!exists) {
            res.status(400).json({ message: "App ID is required" });
            return;
        }
        res.status(200).json(exists)
        return
        // let io = getSocketIo()
        // io.broadcast.emit('post_deleted', deleted);

    } catch (error) {
        console.log(error)
        res.status(404).json(error);

        return

    }
};

export const Update = async (req: Request | any, res: Response | any) => {
    try {
        let updates: any = await App.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        res.status(200).json(updates._id)
        // let io = getSocketIo()
        // io.broadcast.emit('app_updated', updates);
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
}
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

