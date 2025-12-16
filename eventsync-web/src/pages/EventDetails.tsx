import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowLeft, Video, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import type { Event } from '../types';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900">Evento não encontrado</h2>
                <Link to="/" className="mt-4 text-blue-600 hover:text-blue-500">Voltar para o Início</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link to="/" className="flex items-center text-blue-600 hover:text-blue-500 mb-6 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para Eventos
                    </Link>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-5 py-6 sm:px-6 sm:py-8 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 w-3/4">{event.title}</h1>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${event.type === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {event.type === 'PAID' ? `R$ ${event.price}` : 'Gratuito'}
                                </span>
                            </div>

                            <div className="mt-6 flex flex-col space-y-3 text-gray-600">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                                    <span>Início: <strong>{formatDate(event.start_date)}</strong></span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-3 text-red-500" />
                                    <span>Término: <strong>{formatDate(event.end_date)}</strong></span>
                                </div>

                                {event.location_address && (
                                    <div className="flex items-center">
                                        <MapPin className="w-5 h-5 mr-3 text-green-500" />
                                        <span>{event.location_address}</span>
                                    </div>
                                )}

                                {event.location_url && (
                                    <div className="flex items-center">
                                        <Video className="w-5 h-5 mr-3 text-purple-500" />
                                        <a href={event.location_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            Link do Evento Online
                                        </a>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <Users className="w-5 h-5 mr-3 text-orange-500" />
                                    <span>Vagas: {event.max_inscriptions || 'Ilimitadas'}</span>
                                </div>

                                <div className="flex items-center pt-2">
                                    <User className="w-5 h-5 mr-3 text-gray-500" />
                                    <span className="text-sm">Organizado por {event.organizer?.name || 'Evento da Plataforma'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 py-6 sm:px-6 sm:py-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Descrição</h3>
                            <div className="prose prose-blue text-gray-700">
                                <p className="whitespace-pre-line leading-relaxed">{event.description}</p>
                            </div>
                        </div>
                        <div className="px-5 py-4 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-md">
                                Inscrever-se Agora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EventDetails;
