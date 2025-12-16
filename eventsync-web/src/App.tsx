import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import MyRegistrations from './pages/MyRegistrations';
import MyEvents from './pages/MyEvents';
import Checkin from './pages/Checkin';
import './index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-gold-400">Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/my-events" element={
                        <ProtectedRoute>
                            <MyEvents />
                        </ProtectedRoute>
                    } />

                    <Route path="/create-event" element={
                        <ProtectedRoute>
                            <CreateEvent />
                        </ProtectedRoute>
                    } />

                    <Route path="/events/:id/edit" element={
                        <ProtectedRoute>
                            <CreateEvent />
                        </ProtectedRoute>
                    } />

                    <Route path="/events/:id" element={
                        <ProtectedRoute>
                            <EventDetails />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    <Route path="/my-registrations" element={
                        <ProtectedRoute>
                            <MyRegistrations />
                        </ProtectedRoute>
                    } />

                    <Route path="/checkin/:registrationId" element={
                        <ProtectedRoute>
                            <Checkin />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
