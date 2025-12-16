import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Calendar, Plus, User, Ticket } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-rich-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-rich-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <Calendar className="h-7 w-7 text-gold-400 mr-2 transition-transform group-hover:scale-110" />
                            <h1 className="text-lg font-bold text-white tracking-[0.2em] uppercase">
                                Event<span className="text-gold-400">Sync</span>
                            </h1>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex space-x-6">
                            <Link to="/my-registrations" className="flex items-center text-xs font-bold text-gray-400 hover:text-gold-400 transition-colors uppercase tracking-widest">
                                <Ticket size={14} className="mr-2" /> Ingressos
                            </Link>
                            {user?.role === 'ORGANIZER' && (
                                <>
                                    <Link to="/my-events" className="flex items-center text-xs font-bold text-gray-400 hover:text-gold-400 transition-colors uppercase tracking-widest">
                                        <Calendar size={14} className="mr-2" /> Meus Eventos
                                    </Link>
                                    <Link to="/create-event" className="flex items-center text-xs font-bold text-gray-400 hover:text-gold-400 transition-colors uppercase tracking-widest">
                                        <Plus size={14} className="mr-2" /> Criar Evento
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="flex items-center pl-6 border-l border-rich-border space-x-4">
                            <Link to="/profile" className="flex items-center text-sm font-medium text-gold-400 hover:text-white transition-colors">
                                <span className="mr-2">{user?.name}</span>
                                <div className="h-8 w-8 rounded-full bg-rich-gray border border-gold-400 flex items-center justify-center">
                                    <User size={14} className="text-gold-400" />
                                </div>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center p-2 text-gray-500 hover:text-red-500 transition-all" title="Sair">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gold-400 hover:bg-gold-400/10 focus:outline-none"
                        >
                            <span className="sr-only">Abrir menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <div className="md:hidden bg-rich-gray border-b border-rich-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <div className="flex items-center px-3 py-4 border-b border-rich-border mb-2">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 font-bold border border-gold-400/50">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium leading-none text-white">{user?.name}</div>
                                <div className="text-sm font-medium leading-none text-gray-500 mt-1">{user?.email}</div>
                            </div>
                        </div>

                        <Link
                            to="/profile"
                            className="text-gray-300 hover:bg-gold-400/10 hover:text-gold-400 block px-3 py-3 rounded-md text-xs font-bold uppercase tracking-widest"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-3" />
                                Meu Perfil
                            </div>
                        </Link>

                        <Link
                            to="/my-registrations"
                            className="text-gray-300 hover:bg-gold-400/10 hover:text-gold-400 block px-3 py-3 rounded-md text-xs font-bold uppercase tracking-widest"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <Ticket className="w-4 h-4 mr-3" />
                                Meus Ingressos
                            </div>
                        </Link>

                        {user?.role === 'ORGANIZER' && (
                            <>
                                <Link
                                    to="/my-events"
                                    className="text-gray-300 hover:bg-gold-400/10 hover:text-gold-400 block px-3 py-3 rounded-md text-xs font-bold uppercase tracking-widest"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-3" />
                                        Meus Eventos
                                    </div>
                                </Link>
                                <Link
                                    to="/create-event"
                                    className="text-gray-300 hover:bg-gold-400/10 hover:text-gold-400 block px-3 py-3 rounded-md text-xs font-bold uppercase tracking-widest"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <Plus className="w-4 h-4 mr-3" />
                                        Criar Novo Evento
                                    </div>
                                </Link>
                            </>
                        )}

                        <button
                            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                            className="w-full text-left text-red-500 hover:bg-red-900/10 block px-3 py-3 rounded-md text-xs font-bold uppercase tracking-widest mt-4"
                        >
                            <div className="flex items-center">
                                <LogOut className="w-4 h-4 mr-3" />
                                Sair
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
