import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import api from '../services/api';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Credenciais inválidas ou erro no servidor');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-rich-black px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-8 bg-rich-gray rounded-xl border border-rich-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600"></div>

                <div className="text-center">
                    <div className="flex justify-center mx-auto bg-gold-400/10 p-4 rounded-full w-fit mb-4 border border-gold-400/20">
                        <LogIn className="w-8 h-8 text-gold-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-widest uppercase">Bem-vindo</h2>
                    <p className="mt-2 text-xs text-gold-400 uppercase tracking-wide">
                        Acesse sua conta premium
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/30 text-red-500 text-xs rounded-lg p-3 text-center uppercase tracking-wide font-bold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-4 py-3.5 bg-rich-dark border border-rich-border placeholder-gray-600 text-white rounded-lg focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all sm:text-sm"
                                placeholder="usuario@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none block w-full px-4 py-3.5 bg-rich-dark border border-rich-border placeholder-gray-600 text-white rounded-lg focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-gold-400 hover:bg-gold-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-rich-gray focus:ring-gold-400 transition-all duration-200 shadow-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] uppercase tracking-widest"
                        >
                            Entrar
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-400">
                            Não é membro?{' '}
                            <Link to="/register" className="font-bold text-gold-400 hover:underline transition-colors uppercase text-xs tracking-wider">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
