
import { Socket } from "socket.io";
import { MakeActivationCode } from "../utils/generate_activation.util";
import { ChatMessage } from "../types";
import { encryptMessage } from "../utils/encrypt.util";

let io: any = null;
let users: { [key: string]: string } = {};
export const setupSocket = (socketInstance: any) => {
    io = socketInstance;
    io.on("connection", (socket: any) => {
        console.log("SOCKET CONNECTION MADE:", socket.id);

        const { adminId } = socket.handshake.query;

        if (adminId) {
            // Join a room named after the admin
            socket.join(adminId);
            console.log(`User joined room for admin: ${adminId}`);
        }

        // socket.on('join_topic', (topic: any) => {
        //     socket.join(topic);
        //     console.log(`User ${socket.id} joined topic: ${topic}`);

        //     // Optional: Notify others in the room
        //     socket.to(topic).emit('user_joined', {
        //         message: `User ${socket.id} has joined the topic ${topic}`,
        //     });
        // });

        // socket.on('send_message', ({ topic, message }: any) => {
        //     io.to(topic).emit('receive_message', {
        //         sender: socket.id,
        //         message,
        //     });
        // });

        // socket.on('new_post', (post) => {
        //     // Broadcast to all other clients
        //     socket.broadcast.emit('post_added', post);
        // });

        // socket.on('new_comment', (comment) => {
        //     socket.broadcast.emit('comment_added', comment);
        // });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

    });






};
export const getSocketIo = () => io;
