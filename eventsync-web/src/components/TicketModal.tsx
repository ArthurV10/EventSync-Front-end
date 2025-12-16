import React from 'react';
import { X, Calendar, MapPin, User, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Registration } from '../types';

interface TicketModalProps {
    registration: Registration;
    onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ registration, onClose }) => {
    const { event, user } = registration;

    if (!event || !user) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-rich-gray border border-rich-border rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-gold-400 to-gold-600 p-6 text-black relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <CheckCircle size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Ingresso Confirmado</span>
                    </div>
                    <h2 className="text-2xl font-bold leading-tight">{event.title}</h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Event Info */}
                    <div className="space-y-3 text-gray-300">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-gold-400" size={18} />
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Data</p>
                                <p className="text-sm font-bold text-white">{formatDate(event.start_date)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="text-gold-400" size={18} />
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Local</p>
                                <p className="text-sm font-bold text-white">{event.location_address || 'Online'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="text-gold-400" size={18} />
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Participante</p>
                                <p className="text-sm font-bold text-white">{user.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-dashed border-gray-700 relative">
                        <div className="absolute -left-8 -top-3 w-6 h-6 bg-rich-black rounded-full"></div>
                        <div className="absolute -right-8 -top-3 w-6 h-6 bg-rich-black rounded-full"></div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center justify-center space-y-4 pt-2">
                        <div className="bg-white p-4 rounded-xl shadow-lg">
                            <QRCode
                                value={`${window.location.origin}/checkin/${registration.id}`}
                                size={180}
                                level="H"
                            />
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{registration.id}</p>
                        <p className="text-xs text-gold-400 text-center">Apresente este código na entrada do evento</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketModal;
