import React, { useState, useEffect } from 'react';
import type { Event } from '../types';
import { Calendar, MapPin, Video } from 'lucide-react';
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#2A2A2A] pb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] uppercase tracking-wide">Eventos Disponíveis</h2>
                        <p className="mt-1 text-sm text-gray-400">Descubra experiências exclusivas.</p>
                    </div>
                    <Link to="/create-event" className="hidden sm:inline-flex items-center px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-full hover:bg-[#B5952F] shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all hover:scale-105 active:scale-95 uppercase text-xs tracking-wider">
                        Criar Evento
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-20 bg-[#121212] rounded-xl border border-[#2A2A2A]">
                        <p className="text-gray-500 text-lg mb-4">Nenhum evento encontrado no momento.</p>
                        <Link to="/create-event" className="inline-block text-[#D4AF37] font-bold hover:underline uppercase tracking-wide text-sm">
                            Seja o primeiro a criar &gt;
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event.id} className="bg-[#121212] rounded-xl border border-[#2A2A2A] hover:border-[#D4AF37]/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col group">
                                <div className="h-1 bg-gradient-to-r from-[#D4AF37] to-[#8C7323] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-bold text-white truncate w-3/4">{event.title}</h3>
                                        {event.type === 'PAID' ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                                                R$ {event.price}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-white/10 text-white border border-white/20">
                                                FREE
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-6 h-10 leading-relaxed">{event.description}</p>

                                    <div className="space-y-3 pt-4 border-t border-[#2A2A2A]">
                                        <div className="flex items-center text-sm text-gray-300">
                                            <Calendar className="flex-shrink-0 mr-3 h-4 w-4 text-[#D4AF37]" />
                                            <p>{formatDate(event.start_date)}</p>
                                        </div>
                                        {event.location_address && (
                                            <div className="flex items-center text-sm text-gray-300">
                                                <MapPin className="flex-shrink-0 mr-3 h-4 w-4 text-gray-500" />
                                                <p className="truncate">{event.location_address}</p>
                                            </div>
                                        )}
                                        {event.location_url && (
                                            <div className="flex items-center text-sm text-gray-300">
                                                <Video className="flex-shrink-0 mr-3 h-4 w-4 text-gray-500" />
                                                <p className="truncate">Evento Online</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-[#0A0A0A] flex justify-between items-center mt-auto">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {event.organizer?.name || 'Organizador'}
                                    </span>
                                    <Link to={`/events/${event.id}`} className="text-xs font-bold text-[#D4AF37] hover:text-[#B5952F] uppercase tracking-wide flex items-center">
                                        Detalhes <span className="ml-1 text-lg leading-none">&rsaquo;</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
