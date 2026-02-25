import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

export default function App() {
    return (
        <BrowserRouter>
            <WalletProvider>
                <ToastProvider>
                    <Header />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/event/:id" element={<EventDetail />} />
                            <Route path="/create" element={<CreateEvent />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                            {/* 404 fallback */}
                            <Route path="*" element={
                                <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)' }}>
                                    <div style={{ fontSize: '5rem' }}>🔮</div>
                                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Page Not Found</h1>
                                    <p style={{ color: 'var(--text-secondary)' }}>The future is uncertain — but this page definitely doesn't exist.</p>
                                    <a href="/" className="btn btn-primary btn-lg">Back to Markets</a>
                                </div>
                            } />
                        </Routes>
                    </main>
                    <Footer />
                </ToastProvider>
            </WalletProvider>
        </BrowserRouter>
    );
}
