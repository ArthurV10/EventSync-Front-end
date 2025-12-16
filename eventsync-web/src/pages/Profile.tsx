import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Mail, Shield, Camera } from 'lucide-react';
import api from '../services/api';

const Profile: React.FC = () => {
    const { user } = useAuth();
    // Mock state for visibility (in real app, fetch from backend)
    const [visibility, setVisibility] = useState(user?.visibility_participation ?? true);

    const toggleVisibility = async () => {
        const newValue = !visibility;
        setVisibility(newValue);
        try {
            // Assuming endpoint exists, otherwise this is optimistic UI
            await api.put(`/users/${user?.id}`, { visibility_participation: newValue });
        } catch (error) {
            console.error('Failed to update visibility', error);
            // Revert on failure if strict consistency needed
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-200">
            <Navbar />
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden relative">
                    <div className="h-32 bg-gradient-to-r from-[#D4AF37]/20 to-[#000000]"></div>
                    <div className="px-6 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-[#1A1A1A] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] text-3xl font-bold shadow-lg">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-[#D4AF37] p-1.5 rounded-full text-black hover:bg-white cursor-pointer transition-colors shadow-md">
                                    <Camera size={14} />
                                </div>
                            </div>
                            <span className="mb-2 px-3 py-1 rounded-full text-xs font-bold border border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10 uppercase tracking-widest">
                                {user?.role === 'ORGANIZER' ? 'Organizador' : 'Membro Premium'}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-1">{user?.name}</h1>
                        <p className="text-gray-500 text-sm mb-8 flex items-center">
                            <Mail size={14} className="mr-2" /> {user?.email}
                        </p>

                        <div className="border-t border-[#2A2A2A] pt-8 space-y-6">
                            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                                <div className="flex items-center">
                                    <div className="p-3 bg-black rounded-lg border border-[#2A2A2A] mr-4">
                                        <Shield className="text-[#D4AF37]" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm">Visibilidade Pública</h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Permitir que outros vejam minha presença em eventos
                                        </p>
                                    </div>
                                </div>

                                {/* iOS Style Toggle */}
                                <button
                                    onClick={toggleVisibility}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black ${visibility ? 'bg-[#D4AF37]' : 'bg-gray-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${visibility ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
