import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoRoom } from '../components/VideoRoom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI';
import { ArrowLeft } from 'lucide-react';

export const VideoSession: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [hasJoined, setHasJoined] = useState(false);

    if (!user || !sessionId) return <div>Invalid Session</div>;

    if (!hasJoined) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-2xl border border-gray-700">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>

                    <h1 className="text-2xl font-bold text-white">Ready to join?</h1>
                    <p className="text-gray-400">
                        You are about to join session <span className="text-white font-mono">{sessionId}</span>.
                        Please ensure your camera and microphone are ready.
                    </p>

                    <div className="space-y-3 pt-4">
                        <Button
                            size="lg"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 text-lg shadow-lg shadow-emerald-900/50"
                            onClick={() => setHasJoined(true)}
                        >
                            Join Session Now
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-gray-400 hover:text-white hover:bg-gray-700"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={18} className="mr-2" /> Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <VideoRoom
            roomId={sessionId}
            userId={user.id}
            onEndCall={() => navigate(-1)}
        />
    );
};
