import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Mock de evento
    const event = {
        id,
        title: 'Tech Conference 2025',
        description: 'Esta é uma descrição detalhada da Tech Conference 2025. O evento cobrirá diversos tópicos incluindo IA, Desenvolvimento Web e Computação em Nuvem. Junte-se a nós para uma experiência incrível com líderes da indústria.',
        date: '2025-06-15',
        location: 'São Francisco, CA',
        organizer: 'TechWorld'
    };

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
                                    <span>{event.date}</span>
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
