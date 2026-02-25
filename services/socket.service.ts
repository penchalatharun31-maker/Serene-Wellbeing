import { io, Socket } from 'socket.io-client';

// Socket.IO connects to the root URL, not /api/v1
const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '');

class SocketService {
    public socket: Socket | null = null;

    connect(token: string) {
        if (this.socket) return;

        this.socket = io(SOCKET_URL, {
            auth: { token },
            // Start with polling so the HTTP handshake succeeds through Railway/proxies,
            // then upgrade to websocket. Using websocket-only skips this handshake and breaks.
            transports: ['polling', 'websocket'],
            reconnection: true,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // --- Crisis Detection ---
    onCrisisAlert(callback: (data: any) => void) {
        this.socket?.on('crisis:alert', callback);
    }

    // --- Group Therapy / WebRTC ---
    joinGroup(groupId: string) {
        this.socket?.emit('group:join', groupId);
    }

    onGroupUserConnected(callback: (userId: string) => void) {
        this.socket?.on('group:user-connected', callback);
    }

    sendSignal(targetId: string, signal: any) {
        this.socket?.emit('group:signal', { targetId, signal });
    }

    onSignal(callback: (data: { senderId: string; signal: any }) => void) {
        this.socket?.on('group:signal', callback);
    }
}

export const socketService = new SocketService();
