import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, BarChart2, PlusCircle, User, Trophy, Wallet, X, Menu } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { formatAddress } from '../../lib/stacksConfig';

const navLinks = [
    { to: '/', label: 'Explore', icon: BarChart2 },
    { to: '/create', label: 'Create', icon: PlusCircle },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/profile', label: 'Profile', icon: User },
];

export default function Header() {
    const { address, isConnected, connect, disconnect } = useWallet();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [location]);

    return (
        <>
            <header style={{
                position: 'fixed',
                top: 0, left: 0, right: 0,
                height: '68px',
                zIndex: 100,
                transition: 'all 0.3s ease',
                background: scrolled
                    ? 'rgba(8,11,20,0.92)'
                    : 'rgba(8,11,20,0.6)',
                backdropFilter: 'blur(20px)',
                borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
            }}>
                <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{
                            width: 36, height: 36,
                            background: 'var(--grad-primary)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(124,58,237,0.5)',
                        }}>
                            <Zap size={18} color="white" fill="white" />
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            letterSpacing: '-0.01em',
                            color: 'var(--text-primary)',
                        }}>
                            Predict<span className="text-gradient">a</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {navLinks.map(({ to, label, icon: Icon }) => {
                            const active = location.pathname === to;
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '6px 14px',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: active ? 'var(--purple-400)' : 'var(--text-secondary)',
                                        background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}
                                >
                                    <Icon size={15} />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Wallet Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isConnected ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '6px 14px',
                                    background: 'rgba(139,92,246,0.1)',
                                    border: '1px solid var(--border-glow)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: 'var(--purple-400)',
                                }}>
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        background: 'var(--green-400)',
                                        boxShadow: '0 0 6px var(--green-400)',
                                        animation: 'pulse 2s infinite',
                                    }} />
                                    {formatAddress(address)}
                                </div>
                                <button className="btn btn-ghost btn-sm" onClick={disconnect} title="Disconnect">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <button className="btn btn-primary" onClick={connect} style={{ gap: '6px' }}>
                                <Wallet size={15} />
                                <span>Connect Wallet</span>
                            </button>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            className="btn btn-ghost btn-sm hide-desktop"
                            onClick={() => setMobileOpen(v => !v)}
                            style={{ padding: '6px 8px' }}
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div style={{
                    position: 'fixed',
                    top: 68, left: 0, right: 0,
                    background: 'rgba(8,11,20,0.98)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border)',
                    zIndex: 99,
                    padding: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    animation: 'fadeOverlay 0.2s ease',
                }}>
                    {navLinks.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-md)',
                                color: location.pathname === to ? 'var(--purple-400)' : 'var(--text-secondary)',
                                background: location.pathname === to ? 'rgba(139,92,246,0.12)' : 'transparent',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                            }}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
