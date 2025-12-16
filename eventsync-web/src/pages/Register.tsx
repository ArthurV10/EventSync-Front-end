import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../services/api';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
                role
            });
            alert('Cadastro realizado com sucesso!');
            navigate('/login');
        } catch (err: any) {
            console.error(err);
            if (err.response?.data?.issues) {
                const messages = err.response.data.issues.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
                alert(`Erro de validação:\n${messages}`);
            } else if (err.response?.data?.message) {
                alert(`Erro: ${err.response.data.message}`);
            } else {
                alert('Erro ao criar conta. Verifique os dados e tente novamente.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-8 bg-[#121212] rounded-xl border border-[#2A2A2A] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#8C7323]"></div>

                <div className="text-center">
                    <div className="flex justify-center mx-auto bg-[#D4AF37]/10 p-4 rounded-full w-fit mb-4 border border-[#D4AF37]/20">
                        <UserPlus className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-widest uppercase">Junte-se a Nós</h2>
                    <p className="mt-2 text-xs text-[#D4AF37] uppercase tracking-wide">
                        Crie sua conta exclusiva
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Nome Completo</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none block w-full px-4 py-3.5 bg-[#0A0A0A] border border-[#2A2A2A] placeholder-gray-600 text-white rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all sm:text-sm"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-3.5 bg-[#0A0A0A] border border-[#2A2A2A] placeholder-gray-600 text-white rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all sm:text-sm"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Tipo de Conta</label>
                            <div className="relative">
                                <select
                                    id="role"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3.5 bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all sm:text-sm"
                                >
                                    <option value="USER">Participante</option>
                                    <option value="ORGANIZER">Organizador</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Senha</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="appearance-none block w-full px-4 py-3.5 bg-[#0A0A0A] border border-[#2A2A2A] placeholder-gray-600 text-white rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all sm:text-sm"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-[#D4AF37] hover:bg-[#B5952F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#D4AF37] transition-all duration-200 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] uppercase tracking-widest"
                        >
                            Criar Conta
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-400">
                            Já é membro?{' '}
                            <Link to="/login" className="font-bold text-[#D4AF37] hover:underline transition-colors uppercase text-xs tracking-wider">
                                Entrar na conta
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
