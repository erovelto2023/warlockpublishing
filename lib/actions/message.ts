'use server';

import { connectToDatabase } from '@/lib/db';
import Message, { IMessage } from '@/lib/models/Message';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

function serializeMessage(msg: any) {
    return {
        ...msg._doc,
        _id: msg._id.toString(),
        createdAt: msg.createdAt?.toISOString(),
        updatedAt: msg.updatedAt?.toISOString(),
    };
}

export async function createMessage(data: {
    senderName: string;
    senderEmail: string;
    subject: string;
    content: string;
    recipientId?: string;
}) {
    await connectToDatabase();

    const { userId } = await auth();

    // Create message with explicit field handling
    const messageData: any = {
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        subject: data.subject,
        content: data.content,
        senderId: userId || undefined,
        isRead: false,
    };

    // Only add recipientId if it's provided, otherwise leave it undefined
    if (data.recipientId) {
        messageData.recipientId = data.recipientId;
    }

    const newMessage: any = await Message.create(messageData);

    console.log('Message created:', {
        id: newMessage._id?.toString(),
        subject: newMessage.subject,
        recipientId: newMessage.recipientId || 'none (admin)',
        senderId: newMessage.senderId || 'anonymous',
    });

    // Revalidate relevant paths
    revalidatePath('/admin/messages');
    revalidatePath('/dashboard');

    return serializeMessage(newMessage);
}

export async function getAllMessagesForAdmin(options: { page?: number; limit?: number } = {}) {
    await connectToDatabase();
    const { page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    // Get ALL messages for admin view
    const messages = await Message.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Message.countDocuments({});

    console.log(`Admin fetching messages: Found ${total} total messages`);

    return {
        messages: messages.map(serializeMessage),
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
}

export async function getAdminInbox(options: { page?: number; limit?: number } = {}) {
    await connectToDatabase();
    const { page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    // Messages sent TO admin (recipientId is null or doesn't exist)
    const messages = await Message.find({
        $or: [
            { recipientId: null },
            { recipientId: { $exists: false } }
        ]
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Message.countDocuments({
        $or: [
            { recipientId: null },
            { recipientId: { $exists: false } }
        ]
    });

    console.log(`Admin inbox: Found ${total} messages`);

    return {
        messages: messages.map(serializeMessage),
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
}

export async function getUserMessages(userId: string) {
    await connectToDatabase();

    // Messages sent TO the user
    const messages = await Message.find({ recipientId: userId })
        .sort({ createdAt: -1 });

    return messages.map(serializeMessage);
}

export async function getUserSentMessages(userId: string) {
    await connectToDatabase();

    // Messages sent BY the user
    const messages = await Message.find({ senderId: userId })
        .sort({ createdAt: -1 });

    return messages.map(serializeMessage);
}

export async function markMessageAsRead(messageId: string) {
    await connectToDatabase();
    await Message.findByIdAndUpdate(messageId, { isRead: true });
    revalidatePath('/admin/messages');
    revalidatePath('/dashboard');
}

export async function updateMessage(messageId: string, data: any) {
    await connectToDatabase();
    const updated = await Message.findByIdAndUpdate(messageId, data, { new: true });
    revalidatePath('/admin/messages');
    revalidatePath('/dashboard');
    return serializeMessage(updated);
}

export async function deleteMessage(messageId: string) {
    await connectToDatabase();
    await Message.findByIdAndDelete(messageId);
    revalidatePath('/admin/messages');
    revalidatePath('/dashboard');
}

export async function replyToMessage(data: {
    originalMessageId: string;
    recipientId: string;
    subject: string;
    content: string;
}) {
    await connectToDatabase();
    const { userId } = await auth();

    const newMessage = await Message.create({
        senderName: 'Admin Support',
        senderEmail: 'support@warlockpublishing.com',
        subject: `Re: ${data.subject}`,
        content: data.content,
        senderId: userId || undefined,
        recipientId: data.recipientId,
        isRead: false,
    });

    revalidatePath('/admin/messages');
    revalidatePath('/dashboard');

    return serializeMessage(newMessage);
}
