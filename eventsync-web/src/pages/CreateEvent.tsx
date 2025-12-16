import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import type { EventType } from '../types';

const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    // State matching IRequest in backend CreateEventUseCase
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
            // Prepare payload
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
            if (error.response?.data?.issues) {
                const messages = error.response.data.issues.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
                alert(`Erro de validação:\n${messages}`);
            } else {
                alert('Erro ao criar evento. Verifique os dados.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link to="/" className="flex items-center text-blue-600 hover:text-blue-500 mb-6 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Cancelar
                    </Link>
                    <div className="bg-white shadow rounded-lg p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Novo Evento</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Título do Evento</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Data de Início</label>
                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Data de Término</label>
                                    <input
                                        type="datetime-local"
                                        name="end_date"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Locations */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Endereço Presencial (Opcional)</label>
                                    <input
                                        type="text"
                                        name="location_address"
                                        placeholder="Rua Exemplo, 123"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.location_address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Link Online (Opcional)</label>
                                    <input
                                        type="url"
                                        name="location_url"
                                        placeholder="https://meet.google.com/..."
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.location_url}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Price and Type */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="FREE">Gratuito</option>
                                        <option value="PAID">Pago</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        disabled={formData.type === 'FREE'}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                                        value={formData.type === 'FREE' ? 0 : formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vagas Máximas</label>
                                    <input
                                        type="number"
                                        name="max_inscriptions"
                                        min="1"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.max_inscriptions}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Criar Evento
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
