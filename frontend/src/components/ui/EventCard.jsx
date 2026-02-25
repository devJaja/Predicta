import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { formatSTX, STATUS_LABELS, timeUntil } from '../../lib/stacksConfig';

const statusClass = { 0: 'status-open', 1: 'status-closed', 2: 'status-resolved', 3: 'status-invalid' };
const COLORS = ['#a78bfa', '#22d3ee', '#4ade80', '#fbbf24', '#f87171', '#fb923c'];

export default function EventCard({ event }) {
    const {
        id, title, status, totalPool, optionCount, resolveTime, oracleVotes,
        oracleThreshold, pools = {}, options = [],
    } = event;

    const totalPoolNum = Object.values(pools).reduce((a, b) => a + b, 0) || totalPool;

    return (
        <Link to={`/event/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div className="glass-card" style={{ padding: 'var(--space-6)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                {/* Glow accent */}
                <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 120, height: 120,
                    background: `radial-gradient(circle, ${COLORS[id % COLORS.length]}22 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }} />

                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)', gap: 'var(--space-3)' }}>
                    <h3 style={{
                        fontSize: '0.975rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        lineHeight: 1.4,
                        flex: 1,
                    }}>
                        {title}
                    </h3>
                    <span className={`status-badge ${statusClass[status]}`} style={{ flexShrink: 0 }}>
                        <span className="dot dot-pulse" />
                        {STATUS_LABELS[status]}
                    </span>
                </div>

                {/* Pool visualization */}
                {Object.keys(pools).length > 0 && (
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        {/* Bar segments */}
                        <div style={{ display: 'flex', height: 6, borderRadius: 'var(--radius-full)', overflow: 'hidden', gap: '2px', marginBottom: 'var(--space-3)' }}>
                            {Array.from({ length: optionCount }, (_, i) => {
                                const stake = pools[i] || 0;
                                const pct = totalPoolNum > 0 ? (stake / totalPoolNum) * 100 : 100 / optionCount;
                                return (
                                    <div key={i} style={{
                                        flex: pct, height: '100%',
                                        background: COLORS[i % COLORS.length],
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'flex 0.6s ease',
                                        minWidth: 2,
                                    }} />
                                );
                            })}
                        </div>
                        {/* Option labels (show up to 3) */}
                        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                            {(options.length > 0 ? options.slice(0, 3) : Array.from({ length: Math.min(optionCount, 3) }, (_, i) => `Option ${i + 1}`)).map((opt, i) => {
                                const stake = pools[i] || 0;
                                const pct = totalPoolNum > 0 ? ((stake / totalPoolNum) * 100).toFixed(0) : 0;
                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                                        <span style={{ color: 'var(--text-muted)' }}>{opt}</span>
                                        <span style={{ color: COLORS[i % COLORS.length], fontWeight: 700 }}>{pct}%</span>
                                    </div>
                                );
                            })}
                            {optionCount > 3 && (
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>+{optionCount - 3} more</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
                        <StatMini icon={TrendingUp} label="Pool" value={formatSTX(totalPool)} color="var(--purple-400)" />
                        <StatMini icon={Users} label="Oracles" value={`${oracleVotes}/${oracleThreshold}`} color="var(--cyan-400)" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <Clock size={12} />
                        <span>{resolveTime ? `Block ${resolveTime}` : 'TBD'}</span>
                        <ChevronRight size={14} style={{ color: 'var(--purple-400)' }} />
                    </div>
                </div>
            </div>
        </Link>
    );
}

function StatMini({ icon: Icon, label, value, color }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Icon size={10} />
                {label}
            </div>
            <span style={{ color, fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-display)' }}>{value}</span>
        </div>
    );
}
