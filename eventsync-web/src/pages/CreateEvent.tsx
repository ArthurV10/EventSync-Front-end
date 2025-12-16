import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import type { EventType } from '../types';

const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location_address: '',
        location_url: '',
        price: 0,
        type: 'FREE' as EventType,
        max_inscriptions: 100,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'max_inscriptions' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                start_date: new Date(formData.start_date).toISOString(),
                end_date: new Date(formData.end_date).toISOString(),
                location_address: formData.location_address || undefined,
                location_url: formData.location_url || undefined,
                price: formData.price,
                type: formData.type,
                max_inscriptions: formData.max_inscriptions,
            };

            await api.post('/events', payload);
            alert('Evento criado com sucesso!');
            navigate('/');
        } catch (error: any) {
            console.error('Erro ao criar evento:', error);
            alert('Erro ao criar evento. Verifique os dados.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link to="/" className="flex items-center text-gray-400 hover:text-[#D4AF37] mb-8 transition-colors text-sm uppercase tracking-wide font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar
                    </Link>
                    <div className="bg-[#121212] border border-[#2A2A2A] shadow-2xl rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-[#D4AF37] mb-8 uppercase tracking-widest text-center border-b border-[#2A2A2A] pb-4">
                            Novo Evento
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Título do Evento</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="block w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors placeholder-gray-600"
                                    placeholder="Ex: Gala Night 2024"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Descrição</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    required
                                    className="block w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors placeholder-gray-600"
                                    placeholder="Detalhes exclusivos do evento..."
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data Início</label>
                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        required
                                        className="block w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-gray-300 px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data Fim</label>
                                    <input
                                        type="datetime-local"
                                        name="end_date"
                                        required
                                        className="block w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-gray-300 px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Locations */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Local (Presencial)</label>
                                    <input
                                        type="text"
                                        name="location_address"
                                        placeholder="Endereço Completo"
                                        className="block w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        value={formData.location_address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Link (Online)</label>
                                    <input
                                        type="url"
                                        name="location_url"
                                        placeholder="URL da reunião"
                                        className="block w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        value={formData.location_url}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Price / Type / Max */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tipo</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="block w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    >
                                        <option value="FREE">Gratuito</option>
                                        <option value="PAID">Pago</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Preço (R$)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        disabled={formData.type === 'FREE'}
                                        className="block w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={formData.type === 'FREE' ? 0 : formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vagas</label>
                                    <input
                                        type="number"
                                        name="max_inscriptions"
                                        min="1"
                                        className="block w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        value={formData.max_inscriptions}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-black bg-[#D4AF37] hover:bg-[#B5952F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#D4AF37] uppercase tracking-widest transition-all hover:scale-[1.02]"
                                >
                                    Publicar Evento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
