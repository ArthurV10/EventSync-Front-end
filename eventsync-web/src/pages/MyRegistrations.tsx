import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Calendar, QrCode, MapPin } from 'lucide-react';
import TicketModal from '../components/TicketModal';
import type { Registration, RegistrationStatus } from '../types';

const MyRegistrations: React.FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await api.get('/registrations').catch(() => ({ data: [] }));
                setRegistrations(response.data);
            } catch (error) {
                console.error('Error fetching registrations', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    const getStatusBadge = (status: RegistrationStatus) => {
        switch (status) {
            case 'APPROVED':
            case 'CONFIRMED':
                return <span className="px-3 py-1 rounded bg-gold-400 text-black text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(212,175,55,0.4)]">Confirmado</span>;
            case 'PENDING':
            case 'WAITING_PAYMENT':
                return <span className="px-3 py-1 rounded bg-gold-400/20 text-gold-400 border border-gold-400/50 text-xs font-bold uppercase tracking-wider">Pendente</span>;
            case 'REJECTED':
            case 'CANCELED':
                return <span className="px-3 py-1 rounded bg-red-900/20 text-red-500 border border-red-500/30 text-xs font-bold uppercase tracking-wider">Cancelado</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-rich-black text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gold-400 mb-8 uppercase tracking-widest border-b border-rich-border pb-4">Meus Ingressos</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="text-center py-24 bg-rich-gray border border-rich-border rounded-2xl">
                        <p className="text-gray-500 mb-6">Você ainda não tem inscrições.</p>
                        <a href="/" className="px-8 py-3 bg-gold-400 text-black font-bold uppercase tracking-widest rounded hover:bg-gold-500 transition-all">Explorar Eventos</a>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {registrations.map(reg => (
                            <div key={reg.id} className="group bg-rich-gray border border-rich-border rounded-xl overflow-hidden hover:border-gold-400 transition-all duration-300 relative shadow-lg">
                                <div className="absolute top-0 right-0 p-4">
                                    {getStatusBadge(reg.status)}
                                </div>
                                <div className="p-6 pt-12">
                                    <h3 className="text-xl font-bold text-white mb-2 truncate pr-16">{reg.event?.title || 'Evento Indisponível'}</h3>

                                    <div className="space-y-3 mt-4 text-gray-400 text-sm">
                                        <div className="flex items-center">
                                            <Calendar size={16} className="text-gold-400 mr-2" />
                                            <span>
                                                {reg.event?.start_date ? new Date(reg.event.start_date).toLocaleDateString('pt-BR') : 'Data a definir'}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin size={16} className="text-gold-400 mr-2" />
                                            <span className="truncate">{reg.event?.location_address || 'Online'}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedRegistration(reg)}
                                        className="mt-6 w-full py-3 border border-gold-400 text-gold-400 font-bold uppercase tracking-widest text-xs rounded hover:bg-gold-400 hover:text-black transition-all flex items-center justify-center gap-2"
                                    >
                                        <QrCode size={16} />
                                        Ver Cartão
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QR Code Modal */}
            {selectedRegistration && (
                <TicketModal
                    registration={selectedRegistration}
                    onClose={() => setSelectedRegistration(null)}
                />
            )}
        </div>
    );
};

export default MyRegistrations;
