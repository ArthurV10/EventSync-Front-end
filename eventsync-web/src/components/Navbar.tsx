import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Calendar, Plus } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow opacity-90 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <Calendar className="h-8 w-8 text-blue-600 mr-2" />
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EventSync</h1>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/create-event" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                            Criar Evento
                        </Link>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                            <span className="text-xs text-gray-500">{user?.email}</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Sair">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Abrir menu principal</span>
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
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <div className="flex items-center px-3 py-2 border-b border-gray-100 mb-2">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium leading-none text-gray-800">{user?.name}</div>
                                <div className="text-sm font-medium leading-none text-gray-500 mt-1">{user?.email}</div>
                            </div>
                        </div>

                        <Link
                            to="/"
                            className="text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Eventos
                        </Link>
                        <Link
                            to="/create-event"
                            className="text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <Plus className="w-4 h-4 mr-2" />
                                Criar Novo Evento
                            </div>
                        </Link>

                        <button
                            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                            className="w-full text-left text-red-600 hover:bg-red-50 block px-3 py-2 rounded-md text-base font-medium mt-4"
                        >
                            <div className="flex items-center">
                                <LogOut className="w-4 h-4 mr-2" />
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
