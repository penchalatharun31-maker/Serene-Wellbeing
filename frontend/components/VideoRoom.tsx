import React, { useEffect, useState, useRef } from 'react';
import { socketService } from '../services/socket.service';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare, Monitor } from 'lucide-react';
import { Button } from './UI';

interface VideoRoomProps {
    roomId: string;
    userId: string;
    onEndCall: () => void;
}

export const VideoRoom: React.FC<VideoRoomProps> = ({ roomId, userId, onEndCall }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [participants, setParticipants] = useState<string[]>([]);
    const [peers, setPeers] = useState<Map<string, RTCPeerConnection>>(new Map());
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map()); // Ref for mutability
    const localStreamRef = useRef<MediaStream | null>(null);

    // WebRTC Configuration
    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }, // Free Google STUN server
            // In production, add TURN servers here
        ]
    };

    const createPeer = (targetId: string, initiator: boolean, stream: MediaStream) => {
        const peer = new RTCPeerConnection(rtcConfig);

        // Add local stream tracks to peer
        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        // Handle ICE candidates
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socketService.sendSignal(targetId, { type: 'candidate', candidate: event.candidate });
            }
        };

        // Handle remote stream
        peer.ontrack = (event) => {
            console.log(`Received remote stream from ${targetId}`);
            const remoteVideo = document.getElementById(`video-${targetId}`) as HTMLVideoElement;
            if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0];
            } else {
                // Force re-render to create video element if not found (handled by participants state)
            }
        };

        // Create Offer if initiator
        if (initiator) {
            peer.createOffer()
                .then(offer => peer.setLocalDescription(offer))
                .then(() => {
                    socketService.sendSignal(targetId, { type: 'offer', sdp: peer.localDescription });
                })
                .catch(err => console.error('Error creating offer:', err));
        }

        peersRef.current.set(targetId, peer);
        setPeers(new Map(peersRef.current));
        return peer;
    };

    useEffect(() => {
        let mounted = true;

        // 1. Get Local Media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.muted = true; // Mute local video to prevent feedback
                }

                if (!mounted) return;

                // 2. Connect to Socket Group
                socketService.joinGroup(roomId);

                // 3. Listen for New Peers (We initiate call to them)
                socketService.onGroupUserConnected((newUserId) => {
                    console.log('User connected, initiating call to:', newUserId);
                    if (newUserId !== userId) {
                        setParticipants(prev => [...prev, newUserId]);
                        createPeer(newUserId, true, stream);
                    }
                });

                // 4. Handle Signals (Offer, Answer, Candidate)
                socketService.onSignal(async ({ senderId, signal }) => {
                    if (!mounted) return;

                    // Add participant if not known
                    if (!peersRef.current.has(senderId)) {
                        setParticipants(prev => prev.includes(senderId) ? prev : [...prev, senderId]);
                    }

                    let peer = peersRef.current.get(senderId);

                    if (!peer) {
                        // Received offer, so we are receiver (not initiator)
                        if (signal.type === 'offer') {
                            peer = createPeer(senderId, false, stream);
                        } else {
                            console.warn('Received signal for unknown peer:', senderId);
                            return;
                        }
                    }

                    if (signal.type === 'offer') {
                        await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                        const answer = await peer.createAnswer();
                        await peer.setLocalDescription(answer);
                        socketService.sendSignal(senderId, { type: 'answer', sdp: answer });
                    } else if (signal.type === 'answer') {
                        await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    } else if (signal.type === 'candidate') {
                        await peer.addIceCandidate(new RTCIceCandidate(signal.candidate));
                    }
                });

            })
            .catch(err => {
                console.error('Error accessing media:', err);
                alert('Could not access camera/microphone. Please check permissions.');
            });

        return () => {
            mounted = false;
            // Cleanup
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            peersRef.current.forEach(peer => peer.close());
            peersRef.current.clear();
        };
    }, [roomId, userId]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
        }
    };

    const toggleVideo = () => {
        setIsVideoOff(!isVideoOff);
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent flex justify-between items-center z-10">
                <div className="flex items-center gap-2 text-white">
                    <Users size={20} />
                    <span className="font-semibold">Group Session: {roomId}</span>
                    <span className="bg-red-500 text-xs px-2 py-0.5 rounded ml-2">LIVE</span>
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                {/* Local User */}
                <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                    />
                    {isVideoOff && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-white text-2xl font-bold">
                                You
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/40 px-2 py-1 rounded">
                        You {isMuted && '(Muted)'}
                    </div>
                </div>

                {/* Remote Participants */}
                {participants.map(pid => (
                    <div key={pid} className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                        <video
                            id={`video-${pid}`}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/40 px-2 py-1 rounded">
                            Participant {pid.substring(0, 4)}
                        </div>
                    </div>
                ))}

                {participants.length === 0 && (
                    <div className="relative aspect-video bg-gray-800/50 rounded-xl overflow-hidden border-2 border-dashed border-gray-700 flex items-center justify-center flex-col text-gray-500 p-6 text-center">
                        <Users size={48} className="mb-4 opacity-50" />
                        <p>Waiting for others to join...</p>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-gray-900 flex justify-center items-center gap-4">
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-all`}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-all`}
                >
                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>
                <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all">
                    <Monitor size={24} />
                </button>
                <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all">
                    <MessageSquare size={24} />
                </button>
                <button
                    onClick={onEndCall}
                    className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white min-w-[60px] flex items-center justify-center transition-all"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};
