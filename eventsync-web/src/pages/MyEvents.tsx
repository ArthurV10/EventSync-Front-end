import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../types';

const MyEvents: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                // Fetch all events and filter client-side
                // Ideally backend should support /events/me or similar
                const response = await api.get('/events');
                const allEvents = response.data as Event[];
                const myEvents = allEvents.filter(event => event.organizer_id === user?.id);
                setEvents(myEvents);
            } catch (error) {
                console.error('Erro ao buscar eventos', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyEvents();
        }
    }, [user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!user || user.role !== 'ORGANIZER') {
        return (
            <div className="min-h-screen bg-rich-black text-gray-100 flex items-center justify-center">
                <Navbar />
                <p>Acesso restrito a organizadores.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-rich-black text-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-rich-border pb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gold-400 uppercase tracking-wide">Meus Eventos</h2>
                        <p className="mt-1 text-sm text-gray-400">Gerencie seus eventos criados.</p>
                    </div>
                    <Link to="/create-event" className="hidden sm:inline-flex items-center px-6 py-2 bg-gold-400 text-black font-bold rounded-full hover:bg-gold-500 shadow-glow transition-all hover:scale-105 active:scale-95 uppercase text-xs tracking-wider">
                        Criar Novo Evento
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-rich-gray rounded-xl border border-rich-border">
                        <p className="text-gray-500 text-lg mb-4">Você ainda não criou nenhum evento.</p>
                        <Link to="/create-event" className="inline-block text-gold-400 font-bold hover:underline uppercase tracking-wide text-sm">
                            Começar agora &gt;
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <div key={event.id} className="bg-rich-gray rounded-xl overflow-hidden shadow-lg border border-rich-border hover:border-gold-400/50 transition-all duration-300 group flex flex-col h-full">
                                <div className="h-48 bg-rich-dark relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600"></div>
                                    <div className="w-full h-full flex items-center justify-center bg-rich-dark text-gray-700">
                                        <Calendar size={48} className="opacity-20" />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gold-400/30">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${event.type === 'FREE' ? 'text-green-400' : 'text-gold-400'}`}>
                                            {event.type === 'FREE' ? 'Gratuito' : `R$ ${event.price}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center text-xs text-gold-400 mb-2 uppercase tracking-wider font-bold">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {formatDate(event.start_date)}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors line-clamp-1">{event.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>

                                    <div className="flex items-center text-gray-500 text-xs mb-4">
                                        <MapPin className="w-4 h-4 mr-1 text-gray-600" />
                                        <span className="truncate">{event.location_address || 'Local a definir'}</span>
                                    </div>

                                    <div className="pt-4 border-t border-rich-border flex justify-between items-center bg-black/20 -mx-6 -mb-6 px-6 py-4 mt-auto">
                                        <Link to={`/events/${event.id}/edit`} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider flex items-center">
                                            Editar
                                        </Link>
                                        <Link to={`/events/${event.id}`} className="text-xs font-bold text-gold-400 hover:underline uppercase tracking-wider flex items-center">
                                            Gerenciar <ArrowRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyEvents;
