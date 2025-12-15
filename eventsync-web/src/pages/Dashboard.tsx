import React, { useState } from 'react';
import type { Event } from '../types';
import { Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [events] = useState<Event[]>([
        { id: '1', title: 'Tech Conference 2025', description: 'Annual tech gathering for developers and innovators.', date: '2025-06-15', location: 'San Francisco, CA', organizer: 'TechWorld' },
        { id: '2', title: 'Community Meetup', description: 'Local developer meetup to share knowledge and network.', date: '2025-04-20', location: 'New York, NY', organizer: 'DevCommunity' },
        { id: '3', title: 'AI Summit', description: 'Exploring the future of Artificial Intelligence.', date: '2025-08-10', location: 'Austin, TX', organizer: 'AI Future' },
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-4 sm:px-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Eventos Próximos</h2>
                            <p className="mt-1 text-sm text-gray-500">Gerencie e participe de eventos perto de você.</p>
                        </div>
                        {/* Botão de criar evento visível apenas em telas maiores aqui, pois já está no menu mobile */}
                        <Link to="/create-event" className="hidden sm:inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all hover:scale-105 active:scale-95">
                            Criar Evento
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {events.map(event => (
                            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                <div className="p-5 sm:p-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate mb-2">{event.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">{event.description}</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="flex-shrink-0 mr-2 h-4 w-4 text-blue-500" />
                                            <p>{event.date}</p>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="flex-shrink-0 mr-2 h-4 w-4 text-red-500" />
                                            <p>{event.location}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-5 py-3 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{event.organizer}</span>
                                    <Link to={`/events/${event.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                        Ver Detalhes &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
