import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message';
import logger from '../utils/logger';

interface SocketUser {
  userId: string;
  socketId: string;
}

// Store active users
const activeUsers = new Map<string, string>(); // userId -> socketId

export const setupSocket = (io: SocketServer): void => {
  // Authentication middleware
  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      (socket as any).userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    logger.info(`User connected: ${userId} (Socket: ${socket.id})`);

    // Add user to active users
    activeUsers.set(userId, socket.id);

    // Emit online status to all connected users
    socket.broadcast.emit('user:online', { userId });

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // Handle joining conversation rooms
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      logger.info(`User ${userId} joined conversation: ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      logger.info(`User ${userId} left conversation: ${conversationId}`);
    });

    // Handle sending messages
    socket.on(
      'message:send',
      async (data: {
        receiverId: string;
        content: string;
        type?: string;
        fileUrl?: string;
        fileName?: string;
      }) => {
        try {
          const { receiverId, content, type = 'text', fileUrl, fileName } = data;

          // Create conversation ID
          const userIds = [userId, receiverId].sort();
          const conversationId = userIds.join('_');

          // Save message to database
          const message = await Message.create({
            conversationId,
            senderId: userId,
            receiverId,
            content,
            type,
            fileUrl,
            fileName,
          });

          // Populate sender data
          await message.populate('senderId', 'name avatar');

          // Emit to both users
          io.to(`conversation:${conversationId}`).emit('message:received', message);

          // Also emit directly to receiver's user room
          io.to(`user:${receiverId}`).emit('message:new', {
            conversationId,
            message,
          });

          logger.info(`Message sent from ${userId} to ${receiverId}`);
        } catch (error: any) {
          logger.error('Error sending message:', error);
          socket.emit('message:error', { error: error.message });
        }
      }
    );

    // Handle typing indicators
    socket.on(
      'typing:start',
      (data: { conversationId: string; receiverId: string }) => {
        socket
          .to(`user:${data.receiverId}`)
          .emit('typing:user', { userId, conversationId: data.conversationId });
      }
    );

    socket.on(
      'typing:stop',
      (data: { conversationId: string; receiverId: string }) => {
        socket
          .to(`user:${data.receiverId}`)
          .emit('typing:stopped', { userId, conversationId: data.conversationId });
      }
    );

    // Handle message read status
    socket.on('message:read', async (messageIds: string[]) => {
      try {
        const messages = await Message.updateMany(
          {
            _id: { $in: messageIds },
            receiverId: userId,
          },
          {
            isRead: true,
            readAt: new Date(),
          }
        );

        // Notify sender(s) that messages were read
        const updatedMessages = await Message.find({
          _id: { $in: messageIds },
        });

        updatedMessages.forEach((msg) => {
          io.to(`user:${msg.senderId.toString()}`).emit('message:read', {
            messageIds: [msg._id],
            readBy: userId,
          });
        });
      } catch (error: any) {
        logger.error('Error marking messages as read:', error);
      }
    });

    // Handle notifications
    socket.on('notification:read', (notificationId: string) => {
      // Broadcast to user's other devices
      socket.to(`user:${userId}`).emit('notification:read', notificationId);
    });

    // Handle video call signaling
    socket.on('call:initiate', (data: { receiverId: string; offer: any }) => {
      io.to(`user:${data.receiverId}`).emit('call:incoming', {
        callerId: userId,
        offer: data.offer,
      });
    });

    socket.on('call:answer', (data: { callerId: string; answer: any }) => {
      io.to(`user:${data.callerId}`).emit('call:answered', {
        answer: data.answer,
      });
    });

    socket.on('call:ice-candidate', (data: { userId: string; candidate: any }) => {
      io.to(`user:${data.userId}`).emit('call:ice-candidate', {
        candidate: data.candidate,
      });
    });

    socket.on('call:end', (data: { userId: string }) => {
      io.to(`user:${data.userId}`).emit('call:ended');
    });

    // Handle session updates
    socket.on('session:update', (data: { sessionId: string; status: string }) => {
      // Broadcast to relevant users (expert and client)
      io.emit('session:updated', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${userId} (Socket: ${socket.id})`);

      // Remove from active users
      activeUsers.delete(userId);

      // Emit offline status
      socket.broadcast.emit('user:offline', { userId });

      // Stop typing indicators
      socket.broadcast.emit('typing:stopped', { userId });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${userId}:`, error);
    });
  });

  logger.info('Socket.IO setup complete');
};

// Helper function to emit to specific user
export const emitToUser = (
  io: SocketServer,
  userId: string,
  event: string,
  data: any
): void => {
  io.to(`user:${userId}`).emit(event, data);
};

// Helper function to check if user is online
export const isUserOnline = (userId: string): boolean => {
  return activeUsers.has(userId);
};

// Helper function to get online users
export const getOnlineUsers = (): string[] => {
  return Array.from(activeUsers.keys());
};
