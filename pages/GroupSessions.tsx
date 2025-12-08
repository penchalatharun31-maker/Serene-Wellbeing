import React from 'react';
import { GROUP_SESSIONS } from '../data';
import { Card, Button, Badge } from '../components/UI';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

const GroupSessions: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Group Sessions</h1>
                <p className="text-gray-500">Join community workshops, classes, and webinars.</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
                <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                    <option>All Categories</option>
                    <option>Meditation</option>
                    <option>Fitness</option>
                    <option>Nutrition</option>
                </select>
                <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                    <option>Any Date</option>
                    <option>Today</option>
                    <option>This Week</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GROUP_SESSIONS.map(session => (
                <Card key={session.id} className="flex flex-col h-full hover:border-emerald-300 transition-colors">
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <img src={session.image} alt={session.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900 shadow-sm">
                            ${session.price}
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex gap-2 mb-3">
                            {session.tags.map(tag => <Badge key={tag} color="blue">{tag}</Badge>)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{session.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">Hosted by <span className="font-medium text-gray-900">{session.expertName}</span></p>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-emerald-500" />
                                <span>{session.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-emerald-500" />
                                <span>{session.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-emerald-500" />
                                <span>{session.attendees} / {session.maxAttendees} joined</span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Button className="w-full">Book Seat</Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GroupSessions;