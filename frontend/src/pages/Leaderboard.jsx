import React, { useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, Target, Crown } from 'lucide-react';
import { MOCK_LEADERBOARD, MOCK_USER } from '../lib/mockData';
import { formatAddress } from '../lib/stacksConfig';
import { useWallet } from '../context/WalletContext';

const RANKS = ['🥇', '🥈', '🥉'];
const TIER_COLORS = ['#fbbf24', '#94a3b8', '#cd7f32'];

export default function Leaderboard() {
    const { address } = useWallet();
    const [sortBy, setSortBy] = useState('score');

    const sorted = [...MOCK_LEADERBOARD].sort((a, b) => b[sortBy] - a[sortBy]);
    const userRank = sorted.findIndex(u => u.address === (address || MOCK_USER.address)) + 1;
    const myData = MOCK_LEADERBOARD.find(u => u.address === (address || MOCK_USER.address)) || MOCK_USER.reputation;

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="bg-mesh" />
            <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                    <div style={{
                        width: 60, height: 60,
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto var(--space-5)',
                        boxShadow: '0 0 30px rgba(251,191,36,0.3)',
                    }}>
                        <Trophy size={26} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 'var(--space-3)' }}>
                        Top <span className="text-gradient">Predictors</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto' }}>
                        Ranked by reputation earned from accurate predictions across all markets.
                    </p>
                </div>

                {/* Top 3 Podium */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)', maxWidth: 640, margin: '0 auto var(--space-8)' }}>
                    {sorted.slice(0, 3).map((user, i) => (
                        <div
                            key={user.address}
                            className="glass-card"
                            style={{
                                padding: 'var(--space-6)',
                                textAlign: 'center',
                                order: i === 0 ? 2 : i === 1 ? 1 : 3,
                                border: `1px solid ${TIER_COLORS[i]}44`,
                                paddingTop: i === 0 ? 'var(--space-8)' : 'var(--space-6)',
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>{RANKS[i]}</div>
                            <div style={{
                                width: 40, height: 40,
                                background: `linear-gradient(135deg, ${TIER_COLORS[i]}, ${TIER_COLORS[i]}88)`,
                                borderRadius: 'var(--radius-md)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto var(--space-3)',
                                fontSize: '1rem',
                                fontWeight: 800,
                                color: 'white',
                                fontFamily: 'var(--font-display)',
                            }}>
                                {i + 1}
                            </div>
                            <p style={{ fontSize: '0.78rem', color: TIER_COLORS[i], fontWeight: 700, marginBottom: 4 }}>
                                {formatAddress(user.address)}
                            </p>
                            <p style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: TIER_COLORS[i] }}>
                                {user.score}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.wins}W / {user.totalBets}B</p>
                        </div>
                    ))}
                </div>

                {/* Your rank card */}
                {userRank > 0 && (
                    <div style={{
                        padding: 'var(--space-5) var(--space-6)',
                        marginBottom: 'var(--space-8)',
                        background: 'rgba(139,92,246,0.08)',
                        border: '1px solid var(--border-glow)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <Crown size={20} color="var(--purple-400)" />
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Your Ranking</p>
                                <p style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                                    #{userRank} on the Leaderboard
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                            <MiniStat label="Score" value={MOCK_USER.reputation.score} color="var(--purple-400)" />
                            <MiniStat label="Wins" value={MOCK_USER.reputation.wins} color="var(--green-400)" />
                            <MiniStat label="Bets" value={MOCK_USER.reputation.totalBets} color="var(--cyan-400)" />
                        </div>
                    </div>
                )}

                {/* Sort controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Full Rankings</h2>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {['score', 'wins', 'totalBets'].map(key => (
                            <button
                                key={key}
                                className={`btn btn-ghost btn-sm ${sortBy === key ? 'btn-secondary' : ''}`}
                                onClick={() => setSortBy(key)}
                                style={sortBy === key ? { background: 'rgba(139,92,246,0.15)', color: 'var(--purple-400)', borderColor: 'rgba(139,92,246,0.4)' } : {}}
                            >
                                {key === 'score' ? 'Score' : key === 'wins' ? 'Wins' : 'Bets'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '48px 1fr repeat(3, 90px) 80px',
                        padding: 'var(--space-4) var(--space-5)',
                        borderBottom: '1px solid var(--border)',
                        fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>
                        <span>#</span>
                        <span>Address</span>
                        <span style={{ textAlign: 'right' }}>Score</span>
                        <span style={{ textAlign: 'right' }}>Wins</span>
                        <span style={{ textAlign: 'right' }}>Bets</span>
                        <span style={{ textAlign: 'right' }}>Win%</span>
                    </div>

                    {sorted.map((user, i) => {
                        const isMe = user.address === (address || MOCK_USER.address);
                        const winPct = user.totalBets > 0 ? ((user.wins / user.totalBets) * 100).toFixed(0) : 0;
                        return (
                            <div
                                key={user.address}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '48px 1fr repeat(3, 90px) 80px',
                                    padding: 'var(--space-4) var(--space-5)',
                                    borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
                                    background: isMe ? 'rgba(139,92,246,0.06)' : 'transparent',
                                    alignItems: 'center',
                                    transition: 'background 0.2s ease',
                                }}
                                onMouseEnter={e => { if (!isMe) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                                onMouseLeave={e => { if (!isMe) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <div style={{
                                    width: 28, height: 28,
                                    borderRadius: 'var(--radius-sm)',
                                    background: i < 3 ? `${TIER_COLORS[i]}22` : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${i < 3 ? TIER_COLORS[i] + '44' : 'var(--border)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: i < 3 ? '0.9rem' : '0.8rem',
                                    color: i < 3 ? TIER_COLORS[i] : 'var(--text-muted)',
                                }}>
                                    {i < 3 ? RANKS[i] : i + 1}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <div style={{
                                        width: 32, height: 32,
                                        borderRadius: 'var(--radius-sm)',
                                        background: `linear-gradient(135deg, ${['#a78bfa', '#22d3ee', '#4ade80', '#fbbf24', '#f87171', '#fb923c'][i % 6]}, transparent)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', fontWeight: 800, color: 'white',
                                        fontFamily: 'var(--font-display)',
                                    }}>
                                        {user.address.slice(2, 4).toUpperCase()}
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isMe ? 'var(--purple-400)' : 'var(--text-primary)', fontFamily: 'monospace' }}>
                                            {formatAddress(user.address)}
                                        </span>
                                        {isMe && <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--purple-400)', fontWeight: 600 }}>← You</span>}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--purple-400)' }}>{user.score}</div>
                                <div style={{ textAlign: 'right', fontWeight: 600, color: 'var(--green-400)' }}>{user.wins}</div>
                                <div style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{user.totalBets}</div>
                                <div style={{ textAlign: 'right', fontWeight: 700, color: parseInt(winPct) >= 60 ? 'var(--green-400)' : parseInt(winPct) >= 40 ? 'var(--amber-400)' : 'var(--red-400)' }}>
                                    {winPct}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function MiniStat({ label, value, color }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.1rem', color }}>{value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
        </div>
    );
}
