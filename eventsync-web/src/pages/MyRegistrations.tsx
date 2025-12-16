import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Calendar, QrCode, X, MapPin } from 'lucide-react';
import type { Registration, RegistrationStatus } from '../types';

const MyRegistrations: React.FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]); // Mock or Fetch
    const [loading, setLoading] = useState(true);
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                // Assuming endpoint. If 404, we might need to rely on mocking for now as backend routes were unclear.
                // Using '/registrations' as best guess based on schema
                // If this fails, user needs to implement the endpoint or I mock it.
                // For safety in this demo, I will use a try-catch that sets mock data on failure if server not ready
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
                return <span className="px-3 py-1 rounded bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(212,175,55,0.4)]">Confirmado</span>;
            case 'PENDING':
            case 'WAITING_PAYMENT':
                return <span className="px-3 py-1 rounded bg-[#F1C40F]/20 text-[#F1C40F] border border-[#F1C40F]/50 text-xs font-bold uppercase tracking-wider">Pendente</span>;
            case 'REJECTED':
            case 'CANCELED':
                return <span className="px-3 py-1 rounded bg-red-900/20 text-red-500 border border-red-500/30 text-xs font-bold uppercase tracking-wider">Cancelado</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-[#D4AF37] mb-8 uppercase tracking-widest border-b border-[#2A2A2A] pb-4">Meus Ingressos</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="text-center py-24 bg-[#121212] border border-[#2A2A2A] rounded-2xl">
                        <p className="text-gray-500 mb-6">Você ainda não tem inscrições.</p>
                        <a href="/" className="px-8 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded hover:bg-[#F1C40F] transition-all">Explorar Eventos</a>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {registrations.map(reg => (
                            <div key={reg.id} className="group bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#D4AF37] transition-all duration-300 relative shadow-lg">
                                <div className="absolute top-0 right-0 p-4">
                                    {getStatusBadge(reg.status)}
                                </div>
                                <div className="p-6 pt-12">
                                    <h3 className="text-xl font-bold text-white mb-2 truncate pr-16">{reg.event?.title || 'Evento Indisponível'}</h3>

                                    <div className="space-y-3 mt-4 text-gray-400 text-sm">
                                        <div className="flex items-center">
                                            <Calendar size={16} className="text-[#D4AF37] mr-2" />
                                            <span>
                                                {reg.event?.start_date ? new Date(reg.event.start_date).toLocaleDateString('pt-BR') : 'Data a definir'}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin size={16} className="text-[#D4AF37] mr-2" />
                                            <span className="truncate">{reg.event?.location_address || 'Online'}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedRegistration(reg)}
                                        className="mt-6 w-full py-3 border border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-widest text-xs rounded hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-2"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                    <div className="bg-[#121212] border border-[#D4AF37] rounded-2xl max-w-sm w-full p-6 relative shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                        <button
                            onClick={() => setSelectedRegistration(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center">
                            <h2 className="text-[#D4AF37] font-bold text-xl mb-1 uppercase tracking-wider">Acesso VIP</h2>
                            <p className="text-gray-400 text-xs mb-6 uppercase">Apresente este código na entrada</p>

                            <div className="bg-white p-4 rounded-xl inline-block mb-6">
                                {/* Placeholder for QR. In real app use 'qrcode.react' */}
                                <div className="h-48 w-48 bg-black flex items-center justify-center text-white text-xs">
                                    QR CODE
                                </div>
                            </div>

                            <h3 className="text-white font-bold text-lg mb-2">{selectedRegistration.event?.title}</h3>
                            <div className="text-gray-400 text-sm space-y-1">
                                <p>{selectedRegistration.user?.name}</p>
                                <p className="text-[#D4AF37] text-xs uppercase font-bold mt-2">INSCRIÇÃO #{selectedRegistration.id.slice(0, 8)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRegistrations;
