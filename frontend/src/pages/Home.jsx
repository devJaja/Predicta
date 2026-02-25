import React, { useState } from 'react';
import { TrendingUp, Users, Activity, Zap, Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from '../components/ui/EventCard';
import { useEvents } from '../hooks/useEvents';
import { formatSTX } from '../lib/stacksConfig';

const FILTERS = ['All', 'Open', 'Closed', 'Resolved'];
const CATEGORIES = ['All', 'Crypto', 'Sports', 'Finance'];
const STATUS_MAP = { Open: 0, Closed: 1, Resolved: 2 };

export default function Home() {
    const { events, loading } = useEvents();
    const [filter, setFilter] = useState('All');
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');

    const filtered = events.filter(e => {
        const matchStatus = filter === 'All' || e.status === STATUS_MAP[filter];
        const matchCategory = category === 'All' || e.category === category;
        const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchCategory && matchSearch;
    });

    const totalPool = events.reduce((a, e) => a + e.totalPool, 0);
    const openCount = events.filter(e => e.status === 0).length;

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="bg-mesh" />

            {/* ───── Hero ───── */}
            <section style={{ padding: '80px 0 60px', textAlign: 'center', position: 'relative' }}>
                <div className="container">
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(139,92,246,0.1)',
                        border: '1px solid rgba(139,92,246,0.3)',
                        borderRadius: 'var(--radius-full)',
                        padding: '5px 16px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--purple-400)',
                        marginBottom: 'var(--space-6)',
                        letterSpacing: '0.03em',
                    }}>
                        <Zap size={12} fill="currentColor" />
                        Bitcoin-Secured Prediction Markets · Powered by Stacks
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, marginBottom: 'var(--space-5)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                        Predict the Future.{' '}
                        <span className="text-gradient-animated">Earn on Bitcoin.</span>
                    </h1>

                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto var(--space-8)', lineHeight: 1.7 }}>
                        Stake STX on real-world outcomes. Oracles validate results, smart contracts pay winners — no middlemen, no trust required.
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
                        <a href="#markets" className="btn btn-primary btn-lg">
                            Explore Markets <ArrowRight size={16} />
                        </a>
                        <Link to="/create" className="btn btn-ghost btn-lg">
                            Create Market
                        </Link>
                    </div>

                    {/* Platform Stats */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                        <StatPill label="Total Volume" value={formatSTX(totalPool)} color="var(--purple-400)" />
                        <StatPill label="Live Markets" value={openCount} color="var(--green-400)" />
                        <StatPill label="Oracle Network" value="Multi M-of-N" color="var(--cyan-400)" />
                        <StatPill label="Network" value="Stacks L2" color="var(--amber-400)" />
                    </div>
                </div>
            </section>

            {/* ───── Markets Section ───── */}
            <section id="markets" style={{ padding: 'var(--space-8) 0 var(--space-16)', position: 'relative' }}>
                <div className="container">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        {/* Heading + search */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Prediction Markets</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    {filtered.length} market{filtered.length !== 1 ? 's' : ''} found
                                </p>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input
                                    className="input-field"
                                    style={{ paddingLeft: 36, width: 240 }}
                                    placeholder="Search markets..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filter tabs */}
                        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {FILTERS.map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`tab-item ${filter === f ? 'active' : ''}`}
                                        style={{ flex: 'none' }}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                                {CATEGORIES.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setCategory(c)}
                                        className="btn btn-ghost btn-sm"
                                        style={category === c ? { background: 'rgba(34,211,238,0.1)', color: 'var(--cyan-400)', borderColor: 'rgba(34,211,238,0.3)' } : {}}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-16)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <div className="spinner" style={{ width: 36, height: 36 }} />
                                <p style={{ color: 'var(--text-muted)' }}>Loading markets from the blockchain...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="empty-state">
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔮</div>
                                <h3>No Markets Found</h3>
                                <p>Try adjusting your filters or <Link to="/create" style={{ color: 'var(--purple-400)' }}>create the first one</Link>!</p>
                            </div>
                        ) : (
                            <div className="events-grid">
                                {filtered.map(event => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ───── How it Works ───── */}
            <section style={{ padding: 'var(--space-16) 0', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>How Predicta Works</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Fully on-chain. Fully trustless. Secured by Bitcoin.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
                        {STEPS.map((s, i) => (
                            <div key={i} className="glass-card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                                <div style={{
                                    width: 52, height: 52,
                                    borderRadius: 'var(--radius-lg)',
                                    background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    margin: '0 auto var(--space-4)',
                                    boxShadow: `0 0 20px ${s.from}44`,
                                }}>
                                    {s.icon}
                                </div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color: s.from, marginBottom: 'var(--space-2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Step {i + 1}</div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{s.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatPill({ label, value, color }) {
    return (
        <div className="stat-pill">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{label}</div>
        </div>
    );
}

const STEPS = [
    { icon: '🔗', title: 'Connect Wallet', desc: 'Link your Leather or Xverse wallet in one click. No signup needed.', from: '#a78bfa', to: '#7c3aed' },
    { icon: '🔮', title: 'Browse & Predict', desc: 'Choose a market, pick your outcome, and stake your STX.', from: '#22d3ee', to: '#06b6d4' },
    { icon: '⚖️', title: 'Oracle Consensus', desc: 'M-of-N oracles vote on the real-world outcome, ensuring fairness.', from: '#4ade80', to: '#22c55e' },
    { icon: '🏆', title: 'Claim & Earn', desc: 'Winners receive proportional payouts. Earn reputation and NFT badges.', from: '#fbbf24', to: '#f59e0b' },
];
