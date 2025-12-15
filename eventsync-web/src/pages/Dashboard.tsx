import React, { useState, useEffect } from 'react';
import type { Event } from '../types';
import { Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Dashboard: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data);
            } catch (error) {
                console.error('Erro ao buscar eventos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

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

                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Nenhum evento encontrado.</p>
                            <Link to="/create-event" className="mt-4 inline-block text-blue-600 font-medium hover:underline">
                                Crie o primeiro evento!
                            </Link>
                        </div>
                    ) : (
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
                                                <p>{new Date(event.date).toLocaleDateString()}</p>
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
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
