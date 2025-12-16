import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Checkin: React.FC = () => {
    const { registrationId } = useParams<{ registrationId: string }>();
    const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'error'>('loading');
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        const verifyTicket = async () => {
            try {
                // In a real app, this would be a specific check-in endpoint that verifies and marks attendance
                // For now, we'll verify if the registration exists and is approved/confirmed
                const response = await api.get(`/registrations/${registrationId}`);

                if (['APPROVED', 'CONFIRMED'].includes(response.data.status)) {
                    setStatus('valid');
                    setDetails(response.data);
                } else {
                    setStatus('invalid');
                    setDetails(response.data);
                }
            } catch (error) {
                console.error('Checkin error', error);
                setStatus('error');
            }
        };

        if (registrationId) {
            verifyTicket();
        }
    }, [registrationId]);

    return (
        <div className="min-h-screen bg-rich-black flex items-center justify-center p-4">
            <div className="bg-rich-gray border border-rich-border rounded-2xl max-w-md w-full p-8 text-center shadow-2xl relative overflow-hidden">

                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold-400 mb-4"></div>
                        <p className="text-gray-400 animate-pulse">Verificando ingresso...</p>
                    </div>
                )}

                {status === 'valid' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-500/20 text-green-500 mb-6 border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                            <CheckCircle size={48} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wide">Acesso Liberado</h1>
                        <p className="text-green-500 font-bold mb-8 uppercase tracking-widest">Ingresso Válido</p>

                        {details && (
                            <div className="bg-rich-black/50 rounded-xl p-6 mb-8 border border-white/5 text-left space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Evento</p>
                                    <p className="text-white font-bold">{details.event?.title}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Participante</p>
                                    <p className="text-white font-bold">{details.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">ID Inscrição</p>
                                    <p className="font-mono text-gray-400 text-xs">{details.id}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {status === 'invalid' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-500/20 text-red-500 mb-6 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                            <XCircle size={48} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wide">Acesso Negado</h1>
                        <p className="text-red-500 font-bold mb-8 uppercase tracking-widest">
                            Ingresso Inválido ou Pendente
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-yellow-500/20 text-yellow-500 mb-6 border-2 border-yellow-500">
                            <AlertTriangle size={48} />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Erro na Leitura</h1>
                        <p className="text-gray-400 mb-8">Não foi possível verificar o ingresso.</p>
                    </div>
                )}

                <Link to="/" className="inline-block px-8 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors uppercase tracking-widest text-sm">
                    Ir para Home
                </Link>
            </div>
        </div>
    );
};

export default Checkin;
