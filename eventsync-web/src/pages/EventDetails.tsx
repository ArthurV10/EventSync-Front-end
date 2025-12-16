import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowLeft, Users, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../types';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState<any[]>([]);
    const [debugError, setDebugError] = useState<string | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        const fetchEventAndParticipants = async () => {
            // 1. Fetch Event Details
            try {
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);

                if (response.data.isRegistered) {
                    setIsSubscribed(true);
                }
                // If the event response already has registrations, use them
                if (response.data.registrations) {
                    setParticipants(response.data.registrations);
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do evento:', error);
            }

            // 2. Try to fetch full registrations list (if not included or to ensure update)
            // We do this in a separate try/catch because it might fail for non-organizers depending on backend rules
            try {
                const regsResponse = await api.get(`/events/${id}/registrations`);
                setParticipants(regsResponse.data);
            } catch (error: any) {
                if (error.response?.status === 403) {
                    console.info('Acesso à lista de participantes restrito.');
                    // If 403, we don't show an error, we just treat it as "hidden list"
                    setDebugError(null);
                } else {
                    console.warn('Erro ao buscar lista de participantes:', error);
                    setDebugError(`Erro: ${error.response?.status || 'Desconhecido'} - ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventAndParticipants();
        }
    }, [id, user]);

    const handleSubscribe = async () => {
        if (!user) return alert('Faça login para se inscrever');

        if (event?.type === 'PAID') {
            setShowPaymentModal(true);
            return;
        }

        try {
            await api.post(`/events/${id}/registrations`, {}); // Body empty as ID is in URL
            setIsSubscribed(true);
            alert('Inscrição realizada com sucesso!');
        } catch (e) {
            alert('Erro ao se inscrever. Tente novamente.');
        }
    };

    const confirmPayment = async () => {
        setPaymentProcessing(true);
        // Simulate fake payment delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            await api.post(`/events/${id}/registrations`, {});
            setIsSubscribed(true);
            setShowPaymentModal(false);
            alert('Pagamento confirmado! Inscrição realizada.');
        } catch (e) {
            alert('Erro ao processar inscrição pós-pagamento.');
        } finally {
            setPaymentProcessing(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!event) return;

        // Simple confirmation
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este evento? Todas as inscrições serão perdidas.");
        if (!confirmDelete) return;

        try {
            // Backend with "onDelete: Cascade" handles cleanup
            await api.delete(`/events/${event.id}`);

            alert("Evento excluído com sucesso!");
            navigate('/'); // Navigate to Home/Dashboard
        } catch (error) {
            console.error("Erro ao excluir evento:", error);
            alert("Erro ao excluir o evento. Tente novamente.");
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
            <div className="min-h-screen bg-rich-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
            </div>
        );
    }

    if (!event) return null;

    if (!event) return null;

    // Strict Ownership Check: Must be ORGANIZER AND the owner of this event
    const isOwner = user?.role === 'ORGANIZER' && user?.id === event.organizer_id;

    return (
        <div className="min-h-screen bg-rich-black text-gray-100">
            <Navbar />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center text-gray-400 hover:text-gold-400 mb-8 transition-colors text-sm uppercase tracking-wide font-medium">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Eventos
                        </Link>

                        <div className="bg-rich-gray border border-rich-border rounded-xl overflow-hidden shadow-2xl mb-8">
                            <div className="px-6 py-8 sm:px-10 border-b border-rich-border relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600"></div>
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">{event.title}</h1>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border ${event.type === 'PAID' ? 'bg-gold-400/20 text-gold-400 border-gold-400/50' : 'bg-white/10 text-white border-white/20'}`}>
                                        {event.type === 'PAID' ? `R$ ${event.price}` : 'Gratuito'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-300">
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 mr-4 text-gold-400" />
                                        <span>Início: <strong className="text-white ml-2">{formatDate(event.start_date)}</strong></span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 mr-4 text-gray-500" />
                                        <span>Término: <strong className="text-gray-400 ml-2">{formatDate(event.end_date)}</strong></span>
                                    </div>
                                    {event.location_address && (
                                        <div className="flex items-center">
                                            <MapPin className="w-5 h-5 mr-4 text-gold-400" />
                                            <span className="truncate">{event.location_address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-8 sm:px-10 bg-rich-dark">
                                <h3 className="text-sm font-bold text-gold-400 uppercase tracking-widest mb-4">Sobre o Evento</h3>
                                <div className="prose prose-invert prose-gold max-w-none text-gray-300">
                                    <p className="whitespace-pre-line leading-relaxed text-lg">{event.description}</p>
                                </div>
                            </div>

                            <div className="px-6 py-6 sm:px-10 bg-rich-gray border-t border-rich-border flex justify-end">
                                {isOwner ? (
                                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                                        <Link
                                            to={`/events/${id}/edit`}
                                            className="flex-1 bg-blue-600/20 text-blue-500 border border-blue-500/50 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide text-center hover:bg-blue-600/30 transition-colors"
                                        >
                                            Editar Evento
                                        </Link>
                                        <button
                                            onClick={handleDeleteEvent}
                                            className="flex-1 bg-red-600/20 text-red-500 border border-red-500/50 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-red-600/30 transition-colors"
                                        >
                                            Excluir Evento
                                        </button>
                                    </div>
                                ) : isSubscribed ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <button
                                            disabled
                                            className="w-full sm:w-auto bg-green-500/20 text-green-500 border border-green-500/50 px-10 py-4 rounded-lg font-bold text-sm uppercase tracking-widest flex items-center justify-center cursor-default"
                                        >
                                            <CheckCircle className="mr-2 w-5 h-5" /> Você já está inscrito
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!confirm('Deseja cancelar sua inscrição?')) return;
                                                try {
                                                    // Find registration ID for current user
                                                    // We can find it in 'participants' list or rely on 'event.registrations' if available
                                                    // Or assume backend has an endpoint to cancel "my" registration for this event?
                                                    // Since route is DELETE /registrations/:id, we need the ID.
                                                    // We'll search in participants array.
                                                    const myReg = participants.find(p => p.user_id === user?.id || p.user?.email === user?.email);
                                                    if (!myReg) {
                                                        // Fallback: If we can't find it (hidden list?), we might be stuck.
                                                        // But if isSubscribed is true, backend said so.
                                                        // If list is hidden (403), we can't get ID.
                                                        // User said "DELETE /registrations/:id".
                                                        // If we don't have ID, we can't delete.
                                                        // Strategy: If participants list was fetched (even if partial), check there.
                                                        // If not found, show alert saying "Contact Organizer" or similar known limitation if backend doesn't provide ID in /events/:id response.
                                                        alert('Não foi possível identificar sua inscrição para cancelamento. Tente atualizar a página.');
                                                        return;
                                                    }
                                                    await api.delete(`/registrations/${myReg.id}`);
                                                    setIsSubscribed(false);
                                                    setParticipants(prev => prev.filter(p => p.id !== myReg.id));
                                                    alert('Inscrição cancelada.');
                                                } catch (err) {
                                                    console.error(err);
                                                    alert('Erro ao cancelar inscrição.');
                                                }
                                            }}
                                            className="text-red-400 text-xs underline hover:text-red-300"
                                        >
                                            Cancelar Inscrição
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleSubscribe}
                                        className="w-full sm:w-auto bg-gold-400 text-black px-10 py-4 rounded-lg hover:bg-gold-500 transition-all font-bold text-sm uppercase tracking-widest shadow-glow hover:scale-105"
                                    >
                                        Garantir Minha Vaga
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Social */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Organizer Card */}
                        <div className="bg-rich-gray border border-rich-border rounded-xl p-6">
                            <h3 className="text-gold-400 font-bold text-xs uppercase tracking-widest mb-4">Organizado por</h3>
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-rich-dark border border-rich-border flex items-center justify-center text-gray-400">
                                    <User size={20} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-white font-bold">{event.organizer?.name || 'Oficial'}</p>
                                    <p className="text-xs text-gray-500">Membro verificado</p>
                                </div>
                            </div>
                        </div>

                        {/* Participants List */}
                        <div className="bg-rich-gray border border-rich-border rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-gold-400 font-bold text-xs uppercase tracking-widest">Participantes</h3>
                                <div className="flex items-center text-gray-500 text-xs">
                                    <Users size={14} className="mr-1" />
                                    <span>{event.max_inscriptions ? `${participants.length}/${event.max_inscriptions}` : participants.length}</span>
                                </div>
                            </div>

                            {debugError && (
                                <div className="mb-4 p-2 bg-red-900/50 border border-red-500 rounded text-xs text-red-200">
                                    {debugError}
                                </div>
                            )}

                            {/* Participants List */}
                            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                                {participants.length > 0 ? (
                                    participants.map((reg) => (
                                        <div key={reg.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                            <div className="h-8 w-8 rounded-full bg-rich-dark border border-gold-400/30 flex items-center justify-center text-gold-400 text-xs font-bold">
                                                {reg.user?.name?.charAt(0).toUpperCase() || <User size={12} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-200 truncate">{reg.user?.name || 'Usuário'}</p>
                                                <p className="text-xs text-gray-500 truncate">{reg.user?.email || '********'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : isSubscribed && user ? (
                                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-gold-400/10 border border-gold-400/20">
                                        <div className="h-8 w-8 rounded-full bg-gold-400 flex items-center justify-center text-black text-xs font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gold-400 truncate">{user.name} (Você)</p>
                                            <p className="text-xs text-gray-400 truncate">Lista completa restrita ao organizador</p>
                                        </div>
                                        <CheckCircle size={16} className="text-gold-400" />
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm italic text-center py-4">
                                        Seja o primeiro a participar!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Payment Modal */}
            {showPaymentModal && event && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                    <div className="bg-rich-gray border border-gold-400 rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">Confirmar Pagamento</h2>
                            <p className="text-gray-400 mb-6">Este é um evento pago. Realize o pagamento para garantir sua vaga.</p>

                            <div className="bg-white p-6 rounded-xl mb-6 inline-block">
                                <div className="h-40 w-40 bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center border-2 border-dashed border-gray-400 rounded-lg">
                                    QR CODE <br /> PIX
                                    <br />
                                    (Simulação)
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-gold-400 font-bold text-xl">Valor: R$ {event.price}</p>
                                <p className="text-xs text-gray-500 mt-2 break-all bg-black/30 p-2 rounded border border-white/10 font-mono">
                                    00020126330014BR.GOV.BCB.PIX011112345678900520400005303986540510.005802BR5913EventSync Org6008Brasilia62070503***63041D3F
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase">Copia e Cola (Fictício)</p>
                            </div>

                            <button
                                onClick={confirmPayment}
                                disabled={paymentProcessing}
                                className="w-full bg-green-500 text-black font-bold py-4 rounded-lg hover:bg-green-400 transition-colors uppercase tracking-widest flex items-center justify-center"
                            >
                                {paymentProcessing ? (
                                    <>Processing...</>
                                ) : (
                                    <>Confirmar que Paguei</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default EventDetails;
