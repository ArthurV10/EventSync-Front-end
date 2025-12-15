import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react';
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
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{event.title}</h1>
                            <div className="mt-4 flex flex-col sm:flex-row sm:space-x-6 text-gray-600">
                                <div className="flex items-center mt-2 sm:mt-0">
                                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center mt-2 sm:mt-0">
                                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center mt-2 sm:mt-0">
                                    <User className="w-5 h-5 mr-2 text-green-500" />
                                    <span>Organizado por {event.organizer}</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 py-6 sm:px-6 sm:py-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Sobre este Evento</h3>
                            <p className="text-gray-700 leading-relaxed text-base">{event.description}</p>
                        </div>
                        <div className="px-5 py-4 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg sm:text-base">
                                Inscrever-se no Evento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EventDetails;
