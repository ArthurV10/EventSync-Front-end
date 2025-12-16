import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../services/api';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER'); // Default role
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Backend expects: { name, email, password, role }
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
                // Format Zod issues if backend returns them
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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center mx-auto bg-green-100 p-3 rounded-full w-fit">
                        <UserPlus className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">Crie sua conta</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Entrar
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Nome Completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Endereço de Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Endereço de Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Tipo de Conta</label>
                            <select
                                id="role"
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                            >
                                <option value="USER">Participante (Padrão)</option>
                                <option value="ORGANIZER">Organizador</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha (mín. 6 caracteres)</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:bg-green-800"
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
