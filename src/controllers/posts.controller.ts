
import { Request, Response } from "express";

import { Service } from "../models/Service.model";
import { User } from "../models/user.model";
import { getSocketIo } from "../config/socket";
import { sendNotificationToRoom, sendPushNotification } from "../utils/sendNotifications";
import { Post } from "../models/post.model";
import { Comments } from "../models/comments.model";

export const Create = async (req: Request | any, res: Response): Promise<void> => {
    try {
        req.body.createdBy = req.user.userId;
        const newProduct = new Post(req.body);
        await newProduct.save();
        // let io = getSocketIo()
        // io.broadcast.emit('post_added', newProduct);
        res.status(201).json({ message: "Product added successfully", newProduct });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
export const post_comment = async (req: Request | any, res: Response): Promise<void> => {
    try {
        console.log(req)
        const { id } = req.params;

        req.body.postId = id
        req.body.createdBy = req.user.userId;
        const new_comment = new Comments(req.body);
        await new_comment.save();
        const post = await Post.findById(id)
        let newcomments = post?.comments.push(new_comment._id)
        let v = await Post.findOneAndUpdate({ _id: req.params.id }, { comments: newcomments }, { new: true, useFindAndModify: false })


        // let io = getSocketIo()
        // io.broadcast.emit('comment_added', new_comment);
        res.status(201).json({ message: "Product added successfully", new_comment });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
export const toggle_like = async (req: Request | any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const post: any = await Post.findById(id);

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        const userIdStr = req.user.userId.toString();
        const likesAsStrings = post.likes.map((id: string) => id.toString());

        if (likesAsStrings.includes(userIdStr)) {
            // Remove like
            post.likes = post.likes.filter((id: string) => id.toString() !== userIdStr);
            await post.save(); // persist changes
            // let io = getSocketIo();
            // io.broadcast.emit('toggle_like');
            res.status(201).json({ message: "You did unlike" });
        } else {
            // Add like
            post.likes.push(req.user.userId);
            await post.save(); // persist changes
            // let io = getSocketIo();
            // io.broadcast.emit('toggle_like');
            res.status(201).json({ message: "Liked" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const Get = async (req: Request | any, res: Response | any) => {

    try {
        let options: any = { deletedAt: null }
        // if (req.user.role == "admin") {
        //     options = { deletedAt: null, ownedBy: req.user.userId }
        // } else {
        //     options = { deletedAt: null, createdBy: req.user.userId }
        // }
        const { page = 1, limit = 10, } = req.query;
        const posts: any = await Post.find(options).skip((page - 1) * limit)
            .limit(parseInt(limit)).populate('createdBy', 'name').populate('comments', 'text').populate('likes', 'name')
            .sort({ createdAt: -1 })
        const total = await Post.countDocuments();
        res.status(201).json(
            {
                posts, page: parseInt(page),
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

