import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateEvent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location_address: '',
        price: 0,
        type: 'FREE',
        max_inscriptions: 100
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('CreateEvent: Mounted. User:', user, 'ID:', id);
        if (user && user.role !== 'ORGANIZER') {
            const msg = `Acesso negado: Seu papel é ${user.role}, mas é necessário ORGANIZER.`;
            console.warn(msg);
            setError(msg);
            // navigate('/'); // Disable redirect to debug
        }
    }, [user, navigate]);

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            const fetchEvent = async () => {
                try {
                    console.log('CreateEvent: Fetching event', id);
                    const response = await api.get(`/events/${id}`);
                    console.log('CreateEvent: Data received', response.data);
                    const event = response.data;
                    // Format dates for datetime-local input
                    const formatDate = (dateString: string) => {
                        const date = new Date(dateString);
                        const offset = date.getTimezoneOffset() * 60000;
                        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
                    };

                    setFormData({
                        title: event.title,
                        description: event.description,
                        start_date: formatDate(event.start_date),
                        end_date: formatDate(event.end_date),
                        location_address: event.location_address || '',
                        price: event.price || 0,
                        type: event.type,
                        max_inscriptions: event.max_inscriptions || 100
                    });
                } catch (error: any) {
                    console.error('Erro ao carregar evento', error);
                    setError(`Erro ao carregar dados: ${error.message}`);
                    // navigate('/'); // Disable redirect to debug
                }
            };
            fetchEvent();
        }
    }, [id, navigate]);

    // If role is wrong but user exists, show error instead of null
    if (error) {
        return (
            <div className="min-h-screen bg-rich-black text-white flex items-center justify-center p-4">
                <div className="bg-red-900/50 border border-red-500 p-6 rounded-lg max-w-lg text-center">
                    <h2 className="text-xl font-bold mb-2">Erro de Acesso/Carregamento</h2>
                    <p className="mb-4">{error}</p>
                    <button onClick={() => navigate('/')} className="px-4 py-2 bg-white/10 rounded hover:bg-white/20">
                        Voltar para Home
                    </button>
                </div>
            </div>
        );
    }

    if (user?.role !== 'ORGANIZER') return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'max_inscriptions' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode && id) {
                await api.put(`/events/${id}`, {
                    ...formData,
                    // If editing, we might not need to send status, but let's keep it safe or omit
                });
                alert('Evento atualizado com sucesso!');
                navigate(`/events/${id}`);
            } else {
                await api.post('/events', {
                    ...formData,
                    status: 'PUBLISHED'
                });
                alert('Evento criado com sucesso!');
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            alert(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} evento`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-rich-black text-gray-100">
            <Navbar />
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-rich-gray rounded-xl shadow-2xl border border-rich-border overflow-hidden">
                    <div className="px-6 py-6 border-b border-rich-border bg-rich-dark">
                        <h1 className="text-2xl font-bold text-white uppercase tracking-wide">{isEditMode ? 'Editar' : 'Criar Novo'} <span className="text-gold-400">Evento</span></h1>
                        <p className="text-gray-500 text-sm mt-1">{isEditMode ? 'Atualize os detalhes do seu evento.' : 'Preencha os detalhes para lançar sua experiência.'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Título do Evento</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full bg-rich-dark border border-rich-border rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 focus:outline-none transition-all"
                                placeholder="Ex: Workshop de Design"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Descrição</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                className="w-full bg-rich-dark border border-rich-border rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 focus:outline-none transition-all resize-none"
                                placeholder="Detalhes do evento..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Início</label>
                                <input
                                    type="datetime-local"
                                    name="start_date"
                                    required
                                    className="w-full bg-rich-dark border border-rich-border rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 focus:outline-none transition-all [color-scheme:dark]"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Término</label>
                                <input
                                    type="datetime-local"
                                    name="end_date"
                                    required
                                    className="w-full bg-rich-dark border border-rich-border rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 focus:outline-none transition-all [color-scheme:dark]"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Local</label>
                            <input
                                type="text"
                                name="location_address"
                                className="w-full bg-rich-dark border border-rich-border rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 focus:outline-none transition-all"
                                placeholder="Endereço completo ou Link online"
                                value={formData.location_address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Tipo</label>
                                <select
                                    name="type"
                                    className="w-full bg-rich-dark border border-rich-border rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 focus:outline-none transition-all"
                                    value={formData.type}
                                    onChange={handleChange}
                                >
                                    <option value="FREE">Gratuito</option>
                                    <option value="PAID">Pago</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Preço (R$)</label>
                                <input
                                    type="number"
                                    name="price"
                                    disabled={formData.type === 'FREE'}
                                    className="w-full bg-rich-dark border border-rich-border rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 focus:outline-none transition-all disabled:opacity-50"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Vagas</label>
                                <input
                                    type="number"
                                    name="max_inscriptions"
                                    className="w-full bg-rich-dark border border-rich-border rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 focus:outline-none transition-all"
                                    value={formData.max_inscriptions}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-gold-400 text-black font-bold rounded-lg hover:bg-gold-500 shadow-glow uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? (isEditMode ? 'Atualizando...' : 'Criando...') : (isEditMode ? 'Salvar Alterações' : 'Publicar Evento')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
