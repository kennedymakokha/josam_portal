import * as admin from 'firebase-admin';

export async function sendPushNotification({ image, token, text, title, }: { image?: string | any, title: string, token: string, text?: string }) {
    const message: admin.messaging.Message = {
        notification: {
            title: title,
            body: text || 'You have a new message in your room.',

        },
        data: {
            imageUrl: image,
        },
        android: {
            priority: 'high',
            notification: {
                sound: 'default',
            },
        },
        apns: {
            payload: {
                aps: {
                    sound: 'default',
                },
            },
        },
        token: token,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('✅ Successfully sent message:', response);
    } catch (error) {
        console.error('❌ Error sending message:', error);
    }
}

export async function sendNotificationToRoom({ roomId, text }: { roomId: string, text?: string }) {
    const topic = `room_${roomId}`;
    const message: admin.messaging.Message = {
        topic,
        notification: {
            title: 'New Message',
            body: text || 'You have a new message in your room.',
        },
        data: {
            roomId,
            type: 'chat_message',
            text: text || '',
        },
        android: {
            priority: 'high',
            notification: {
                sound: 'default',
            },
        },
        apns: {
            payload: {
                aps: {
                    sound: 'default',
                },
            },
        },
    };

    try {
        const response = await admin.messaging().send(message);
        console.log(`✅ Notification sent to room "${roomId}":`, response);
    } catch (error) {
        console.error('❌ Error sending notification to room:', error);
    }
}


export async function subscribeToRoom({ roomId, tokens }: { roomId: string, tokens: [] | any }) {
    admin.messaging().subscribeToTopic(tokens, roomId)
        .then(response => {
            console.log('Subscribed successfully:', response);
        })
        .catch(error => {
            console.error('Subscription error:', error);
        });
}