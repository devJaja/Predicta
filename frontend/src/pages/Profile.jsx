import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { MOCK_USER, MOCK_EVENTS } from '../lib/mockData';
import { BADGE_INFO, formatSTX, formatAddress, STX_DECIMALS } from '../lib/stacksConfig';
import { Star, Target, Award, TrendingUp, ChevronRight, ExternalLink } from 'lucide-react';

const TIER_CONFIG = [
    { label: 'Bronze', min: 0, max: 49, color: '#cd7f32', bg: 'rgba(205,127,50,0.1)', icon: '🥉', fee: '2%' },
    { label: 'Silver', min: 50, max: 99, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', icon: '🥈', fee: '1.5%' },
    { label: 'Gold', min: 100, max: 9999, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: '🥇', fee: '1%' },
];

function getTier(score) {
    return TIER_CONFIG.find(t => score >= t.min && score <= t.max) || TIER_CONFIG[0];
}

const statusClass = { 0: 'status-open', 1: 'status-closed', 2: 'status-resolved', 3: 'status-invalid' };
const STATUS_LABELS = { 0: 'Open', 1: 'Closed', 2: 'Resolved', 3: 'Invalid' };

export default function Profile() {
    const { isConnected, connect, address } = useWallet();
    const [activeTab, setActiveTab] = useState('bets');

    // Use mock user for demo; in prod fetch from contract via address
    const user = MOCK_USER;
    const tier = getTier(user.reputation.score);
    const COLORS = ['#a78bfa', '#22d3ee', '#4ade80', '#fbbf24', '#f87171', '#fb923c'];

    const winRate = user.reputation.totalBets > 0
        ? ((user.reputation.wins / user.reputation.totalBets) * 100).toFixed(0)
        : 0;

    if (!isConnected) {
        return (
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="bg-mesh" />
                <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)' }}>
                    <div style={{ fontSize: '4rem' }}>👤</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Connect to View Profile</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
                        Connect your Leather or Xverse wallet to view your reputation, badges, and bet history.
                    </p>
                    <button className="btn btn-primary btn-lg" onClick={connect}>
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="bg-mesh" />
            <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>

                {/* Profile Header */}
                <div className="glass-card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', alignItems: 'center' }}>
                        {/* Avatar */}
                        <div style={{
                            width: 80, height: 80,
                            background: 'var(--grad-primary)',
                            borderRadius: 'var(--radius-xl)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem',
                            boxShadow: 'var(--shadow-glow)',
                            flexShrink: 0,
                            border: `3px solid ${tier.color}44`,
                        }}>
                            {tier.icon}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800 }}>
                                    {formatAddress(address || user.address)}
                                </h1>
                                <span style={{
                                    padding: '3px 12px',
                                    borderRadius: 'var(--radius-full)',
                                    background: tier.bg,
                                    border: `1px solid ${tier.color}44`,
                                    color: tier.color,
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                }}>
                                    {tier.icon} {tier.label} Tier
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-3)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                    {address || user.address}
                                </span>
                                <a href={`https://explorer.hiro.so/address/${address || user.address}?chain=testnet`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ color: 'var(--purple-400)' }}>
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '2px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)' }}>
                                    💰 Balance: {formatSTX(user.balance)}
                                </span>
                                <span style={{ fontSize: '0.78rem', color: tier.color, padding: '2px 10px', background: tier.bg, borderRadius: 'var(--radius-full)', border: `1px solid ${tier.color}33` }}>
                                    ⚡ Fee: {tier.fee}
                                </span>
                            </div>
                        </div>

                        {/* Rep Score */}
                        <div style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-6)', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 'var(--radius-xl)' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {user.reputation.score}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                Reputation
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    <StatCard icon={Target} label="Total Bets" value={user.reputation.totalBets} color="var(--purple-400)" />
                    <StatCard icon={Star} label="Wins" value={user.reputation.wins} color="var(--green-400)" />
                    <StatCard icon={TrendingUp} label="Win Rate" value={`${winRate}%`} color="var(--cyan-400)" />
                    <StatCard icon={Award} label="Badges" value={user.badges.length} color="var(--amber-400)" />
                </div>

                {/* Reputation Progress to next tier */}
                <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: tier.color, boxShadow: `0 0 8px ${tier.color}` }} />
                            <span style={{ fontWeight: 700, color: tier.color }}>{tier.label} Tier</span>
                        </div>
                        {user.reputation.score < 100 && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {user.reputation.score >= 50 ? 100 - user.reputation.score : 50 - user.reputation.score} points to next tier
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {TIER_CONFIG.map((t, i) => (
                            <React.Fragment key={t.label}>
                                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: user.reputation.score >= t.min ? t.color : 'var(--text-muted)' }}>
                                    <div style={{ fontSize: '1.2rem' }}>{t.icon}</div>
                                    <div style={{ fontWeight: 600 }}>{t.label}</div>
                                </div>
                                {i < TIER_CONFIG.length - 1 && (
                                    <div style={{ flex: 1, height: 4, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                        <div style={{
                                            width: user.reputation.score > t.max ? '100%' : `${Math.max(0, ((user.reputation.score - t.min) / (t.max - t.min)) * 100)}%`,
                                            height: '100%',
                                            background: t.color,
                                            borderRadius: 'var(--radius-full)',
                                            transition: 'width 0.8s ease',
                                        }} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="tab-bar" style={{ marginBottom: 'var(--space-6)' }}>
                    {['bets', 'badges'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'bets' ? '📋 Bet History' : '🏅 Badges'}
                        </button>
                    ))}
                </div>

                {/* Bets Tab */}
                {activeTab === 'bets' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {user.bets.length === 0 ? (
                            <div className="empty-state">
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📋</div>
                                <h3>No bets yet</h3>
                                <p>Start predicting to build your history!</p>
                                <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Explore Markets</Link>
                            </div>
                        ) : user.bets.map((bet, i) => {
                            const event = MOCK_EVENTS.find(e => e.id === bet.eventId);
                            if (!event) return null;
                            const optionLabel = event.options?.[bet.option] || `Option ${bet.option + 1}`;
                            return (
                                <Link key={i} to={`/event/${event.id}`} style={{ textDecoration: 'none' }}>
                                    <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>{event.title}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <span className={`status-badge ${statusClass[event.status]}`} style={{ fontSize: '0.7rem' }}>{STATUS_LABELS[event.status]}</span>
                                                <span style={{ fontSize: '0.8rem', color: COLORS[bet.option % COLORS.length], fontWeight: 600 }}>→ {optionLabel}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--purple-400)' }}>{formatSTX(bet.amount)}</p>
                                                {bet.claimed && <p style={{ fontSize: '0.75rem', color: 'var(--green-400)' }}>✓ Claimed</p>}
                                            </div>
                                            <ChevronRight size={16} color="var(--text-muted)" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Badges Tab */}
                {activeTab === 'badges' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-5)' }}>
                        {[1, 2, 3, 4].map(badgeId => {
                            const info = BADGE_INFO[badgeId];
                            const earned = user.badges.includes(badgeId);
                            return (
                                <div key={badgeId} className="glass-card" style={{
                                    padding: 'var(--space-6)',
                                    textAlign: 'center',
                                    opacity: earned ? 1 : 0.45,
                                    filter: earned ? 'none' : 'grayscale(0.8)',
                                    border: earned ? `1px solid ${info.color}44` : '1px solid var(--border)',
                                }}>
                                    <div style={{
                                        width: 64, height: 64,
                                        background: earned ? `radial-gradient(circle, ${info.color}22, transparent)` : 'rgba(255,255,255,0.03)',
                                        border: `2px solid ${earned ? info.color : 'var(--border)'}`,
                                        borderRadius: 'var(--radius-xl)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2rem',
                                        margin: '0 auto var(--space-4)',
                                        boxShadow: earned ? `0 0 20px ${info.color}33` : 'none',
                                    }}>
                                        {info.icon}
                                    </div>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 'var(--space-2)', color: earned ? info.color : 'var(--text-muted)' }}>
                                        {info.name}
                                    </h3>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{info.description}</p>
                                    {earned && (
                                        <div style={{ marginTop: 'var(--space-3)', fontSize: '0.72rem', fontWeight: 700, color: info.color }}>
                                            ✓ Earned
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Icon size={12} /> {label}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-display)', color }}>{value}</div>
        </div>
    );
}
