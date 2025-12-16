import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowLeft, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../types';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    // Mock participants for demo if backend doesn't send them yet
    const [participants] = useState<any[]>([]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);
                // Mocking participants fetch logic or using response.data.registrations if available
                // In a real scenario: api.get(`/events/${id}/registrations`)
            } catch (error) {
                console.error('Erro ao buscar detalhes do evento:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    const handleSubscribe = async () => {
        if (!user) return alert('Faça login para se inscrever');
        try {
            await api.post('/registrations', { event_id: id });
            alert('Inscrição realizada!');
        } catch (e) {
            alert('Erro ao se inscrever');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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

    if (!event) return null;

    return (
        <div className="min-h-screen bg-black text-gray-100">
            <Navbar />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center text-gray-400 hover:text-[#D4AF37] mb-8 transition-colors text-sm uppercase tracking-wide font-medium">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Eventos
                        </Link>

                        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden shadow-2xl mb-8">
                            <div className="px-6 py-8 sm:px-10 border-b border-[#2A2A2A] relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#8C7323]"></div>
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">{event.title}</h1>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border ${event.type === 'PAID' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50' : 'bg-white/10 text-white border-white/20'}`}>
                                        {event.type === 'PAID' ? `R$ ${event.price}` : 'Gratuito'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-300">
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 mr-4 text-[#D4AF37]" />
                                        <span>Início: <strong className="text-white ml-2">{formatDate(event.start_date)}</strong></span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 mr-4 text-gray-500" />
                                        <span>Término: <strong className="text-gray-400 ml-2">{formatDate(event.end_date)}</strong></span>
                                    </div>
                                    {event.location_address && (
                                        <div className="flex items-center">
                                            <MapPin className="w-5 h-5 mr-4 text-[#D4AF37]" />
                                            <span className="truncate">{event.location_address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-8 sm:px-10 bg-[#0A0A0A]">
                                <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-4">Sobre o Evento</h3>
                                <div className="prose prose-invert prose-gold max-w-none text-gray-300">
                                    <p className="whitespace-pre-line leading-relaxed text-lg">{event.description}</p>
                                </div>
                            </div>

                            <div className="px-6 py-6 sm:px-10 bg-[#121212] border-t border-[#2A2A2A] flex justify-end">
                                <button
                                    onClick={handleSubscribe}
                                    className="w-full sm:w-auto bg-[#D4AF37] text-black px-10 py-4 rounded-lg hover:bg-[#B5952F] transition-all font-bold text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:scale-105"
                                >
                                    Garantir Minha Vaga
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Social */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Organizer Card */}
                        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                            <h3 className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest mb-4">Organizado por</h3>
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-gray-400">
                                    <User size={20} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-white font-bold">{event.organizer?.name || 'Oficial'}</p>
                                    <p className="text-xs text-gray-500">Membro verificado</p>
                                </div>
                            </div>
                        </div>

                        {/* Participants List */}
                        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">Participantes</h3>
                                <div className="flex items-center text-gray-500 text-xs">
                                    <Users size={14} className="mr-1" />
                                    <span>{event.max_inscriptions ? `${participants.length}/${event.max_inscriptions}` : participants.length}</span>
                                </div>
                            </div>

                            {/* Mock List for Demo */}
                            <div className="space-y-4">
                                <p className="text-gray-500 text-sm italic text-center py-4">
                                    {participants.length > 0 ? '' : 'Seja o primeiro a participar!'}
                                </p>
                                {/* Example Item if participants existed */}
                                {/* 
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-gray-800"></div>
                                        <span className="ml-3 text-sm text-gray-300">Alice Silva</span>
                                    </div>
                                    <button className="text-gray-600 hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all">
                                        <UserPlus size={16} />
                                    </button>
                                </div> 
                                */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EventDetails;
