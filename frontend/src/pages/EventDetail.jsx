import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, TrendingUp, Users, Shield, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { openContractCall } from '@stacks/connect';
import { MOCK_EVENTS, POOL_SPLITS } from '../lib/mockData';
import { formatSTX, STATUS_LABELS, toMicroSTX, STX_DECIMALS } from '../lib/stacksConfig';
import { buildPlaceBetOptions, buildClaimWinningsOptions } from '../lib/contracts/core';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

const COLORS = ['#a78bfa', '#22d3ee', '#4ade80', '#fbbf24', '#f87171', '#fb923c'];
const STATUS_CLASS = { 0: 'status-open', 1: 'status-closed', 2: 'status-resolved', 3: 'status-invalid' };
const STATUS_ICONS = { 0: '🟢', 1: '🟡', 2: '✅', 3: '❌' };

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isConnected, connect, address } = useWallet();
    const toast = useToast();

    const [event, setEvent] = useState(null);
    const [pools, setPools] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [betAmount, setBetAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [txPending, setTxPending] = useState(false);

    useEffect(() => {
        const ev = MOCK_EVENTS.find(e => e.id === parseInt(id));
        if (ev) {
            setEvent(ev);
            setPools(POOL_SPLITS[ev.id] || {});
        }
    }, [id]);

    if (!event) {
        return (
            <div className="container section" style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ width: 36, height: 36, margin: '0 auto var(--space-4)' }} />
                <p style={{ color: 'var(--text-muted)' }}>Loading market...</p>
            </div>
        );
    }

    const totalPool = Object.values(pools).reduce((a, b) => a + b, 0) || event.totalPool;
    const options = event.options?.length > 0
        ? event.options
        : Array.from({ length: event.optionCount }, (_, i) => `Option ${i + 1}`);

    const canBet = event.status === 0 && isConnected;

    // Calculate estimated payout
    const estimatedPayout = (() => {
        if (!selectedOption !== null && betAmount && totalPool > 0) {
            const amtMicro = toMicroSTX(betAmount);
            const optPool = (pools[selectedOption] || 0) + amtMicro;
            const newTotal = totalPool + amtMicro;
            const fee = 0.02;
            const payout = (amtMicro / optPool) * newTotal * (1 - fee);
            return payout / STX_DECIMALS;
        }
        return 0;
    })();

    const handlePlaceBet = async () => {
        if (!isConnected) { connect(); return; }
        if (selectedOption === null) { toast.error('Please select an outcome'); return; }
        if (!betAmount || parseFloat(betAmount) <= 0) { toast.error('Enter a valid STX amount'); return; }

        setTxPending(true);
        try {
            const opts = buildPlaceBetOptions(event.id, selectedOption, toMicroSTX(betAmount));
            await openContractCall({
                ...opts,
                onFinish: (data) => {
                    toast.success(`Bet placed! TX: ${data.txId?.slice(0, 10)}...`);
                    setTxPending(false);
                    setBetAmount('');
                    setSelectedOption(null);
                },
                onCancel: () => {
                    toast.info('Transaction cancelled');
                    setTxPending(false);
                },
            });
        } catch (err) {
            toast.error(`Error: ${err.message}`);
            setTxPending(false);
        }
    };

    const handleClaimWinnings = async () => {
        setTxPending(true);
        try {
            const opts = buildClaimWinningsOptions(event.id);
            await openContractCall({
                ...opts,
                onFinish: (data) => {
                    toast.success('Winnings claimed successfully!');
                    setTxPending(false);
                },
                onCancel: () => {
                    toast.info('Transaction cancelled');
                    setTxPending(false);
                },
            });
        } catch (err) {
            toast.error(`Error: ${err.message}`);
            setTxPending(false);
        }
    };

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="bg-mesh" />
            <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>
                {/* Back */}
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: 'var(--space-6)', gap: '6px' }}
                >
                    <ArrowLeft size={15} /> Back to Markets
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 'var(--space-8)', alignItems: 'start' }}>

                    {/* ───── Left: Event Info ───── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

                        {/* Header Card */}
                        <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
                                        <span className={`status-badge ${STATUS_CLASS[event.status]}`}>
                                            <span className="dot" /> {STATUS_LABELS[event.status]}
                                        </span>
                                        {event.category && (
                                            <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(34,211,238,0.1)', color: 'var(--cyan-400)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(34,211,238,0.2)' }}>
                                                {event.category}
                                            </span>
                                        )}
                                    </div>
                                    <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 800, lineHeight: 1.3, maxWidth: 560 }}>{event.title}</h1>
                                </div>
                            </div>

                            {/* Stats grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-4)' }}>
                                <InfoStat icon={TrendingUp} label="Total Pool" value={formatSTX(totalPool)} color="var(--purple-400)" />
                                <InfoStat icon={Users} label="Oracle Votes" value={`${event.oracleVotes} / ${event.oracleThreshold}`} color="var(--cyan-400)" />
                                <InfoStat icon={Clock} label="Resolve Block" value={`#${event.resolveTime}`} color="var(--amber-400)" />
                                <InfoStat icon={Shield} label="Options" value={event.optionCount} color="var(--green-400)" />
                            </div>
                        </div>

                        {/* Pool Breakdown */}
                        <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-5)', color: 'var(--text-secondary)' }}>
                                Market Breakdown
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {options.map((opt, i) => {
                                    const staked = pools[i] || 0;
                                    const pct = totalPool > 0 ? ((staked / totalPool) * 100) : (100 / event.optionCount);
                                    const isWinner = event.status === 2 && event.outcome === i;
                                    return (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: isWinner ? 'var(--green-400)' : 'var(--text-primary)' }}>
                                                        {opt}
                                                    </span>
                                                    {isWinner && <CheckCircle size={14} color="var(--green-400)" />}
                                                </div>
                                                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatSTX(staked)}</span>
                                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: COLORS[i % COLORS.length], minWidth: 42, textAlign: 'right' }}>
                                                        {pct.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Oracle Status */}
                        <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>Oracle Status</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <div style={{
                                    flex: 1, height: 8, background: 'rgba(255,255,255,0.06)',
                                    borderRadius: 'var(--radius-full)', overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${Math.min((event.oracleVotes / event.oracleThreshold) * 100, 100)}%`,
                                        height: '100%',
                                        background: 'var(--grad-primary)',
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'width 0.6s ease',
                                    }} />
                                </div>
                                <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--purple-400)', whiteSpace: 'nowrap' }}>
                                    {event.oracleVotes} / {event.oracleThreshold} votes
                                </span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
                                {event.oracleVotes >= event.oracleThreshold
                                    ? '✅ Consensus reached — ready to resolve'
                                    : `Awaiting ${event.oracleThreshold - event.oracleVotes} more oracle votes for consensus`}
                            </p>
                        </div>

                        {/* Claim button (resolved events) */}
                        {event.status === 2 && (
                            <div className="glass-card" style={{ padding: 'var(--space-6)', border: '1px solid rgba(74,222,128,0.3)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    <CheckCircle size={20} color="var(--green-400)" />
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green-400)' }}>Event Resolved</h2>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>
                                    Winning outcome: <strong style={{ color: 'var(--green-400)' }}>{options[event.outcome]}</strong>
                                </p>
                                {!isConnected ? (
                                    <button className="btn btn-primary w-full" onClick={connect}>Connect to Claim Winnings</button>
                                ) : (
                                    <button
                                        className="btn w-full"
                                        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', boxShadow: '0 4px 15px rgba(34,197,94,0.3)' }}
                                        onClick={handleClaimWinnings}
                                        disabled={txPending}
                                    >
                                        {txPending ? <><div className="spinner" /> Claiming...</> : '🏆 Claim Winnings'}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Invalid refund */}
                        {event.status === 3 && (
                            <div className="glass-card" style={{ padding: 'var(--space-6)', border: '1px solid rgba(239,68,68,0.3)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    <AlertTriangle size={20} color="var(--red-400)" />
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--red-400)' }}>Event Invalidated</h2>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>
                                    This event was marked invalid. All bettors receive a full STX refund.
                                </p>
                                <button
                                    className="btn btn-danger w-full"
                                    onClick={handleClaimWinnings}
                                    disabled={txPending || !isConnected}
                                >
                                    {txPending ? <><div className="spinner" /> Processing...</> : '↩️ Claim Full Refund'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ───── Right: Bet Panel ───── */}
                    <div style={{ position: 'sticky', top: 84 }}>
                        <div className="glass-card" style={{ padding: 'var(--space-6)', border: event.status === 0 ? '1px solid var(--border-glow)' : '1px solid var(--border)' }}>
                            {event.status !== 0 ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-4) 0', color: 'var(--text-muted)' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>{STATUS_ICONS[event.status]}</div>
                                    <h3 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Market {STATUS_LABELS[event.status]}</h3>
                                    <p style={{ fontSize: '0.85rem' }}>This market is no longer accepting bets.</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-5)' }}>
                                        <Zap size={16} color="var(--purple-400)" fill="var(--purple-400)" />
                                        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Place Your Prediction</h2>
                                    </div>

                                    {/* Option Selector */}
                                    <div style={{ marginBottom: 'var(--space-5)' }}>
                                        <label className="input-label">Choose Outcome</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {options.map((opt, i) => {
                                                const staked = pools[i] || 0;
                                                const pct = totalPool > 0 ? ((staked / totalPool) * 100).toFixed(0) : 0;
                                                const selected = selectedOption === i;
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedOption(i)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            padding: '12px 14px',
                                                            borderRadius: 'var(--radius-md)',
                                                            border: `1.5px solid ${selected ? COLORS[i % COLORS.length] : 'var(--border)'}`,
                                                            background: selected ? `${COLORS[i % COLORS.length]}15` : 'rgba(255,255,255,0.03)',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{
                                                                width: 18, height: 18, borderRadius: 4,
                                                                border: `2px solid ${COLORS[i % COLORS.length]}`,
                                                                background: selected ? COLORS[i % COLORS.length] : 'transparent',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                transition: 'all 0.2s ease',
                                                            }}>
                                                                {selected && <div style={{ width: 6, height: 6, borderRadius: 1, background: '#fff' }} />}
                                                            </div>
                                                            <span style={{ color: selected ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: selected ? 700 : 500, fontSize: '0.9rem' }}>
                                                                {opt}
                                                            </span>
                                                        </div>
                                                        <span style={{ color: COLORS[i % COLORS.length], fontWeight: 700, fontSize: '0.85rem' }}>{pct}%</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="input-group">
                                        <label className="input-label">Stake Amount (STX)</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                className="input-field"
                                                type="number"
                                                min="0.000001"
                                                step="0.1"
                                                placeholder="0.00"
                                                value={betAmount}
                                                onChange={e => setBetAmount(e.target.value)}
                                                style={{ paddingRight: 60 }}
                                            />
                                            <span style={{
                                                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                                color: 'var(--purple-400)', fontSize: '0.8rem', fontWeight: 700,
                                            }}>STX</span>
                                        </div>
                                        {/* Quick amounts */}
                                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                            {['1', '5', '10', '50'].map(v => (
                                                <button key={v} className="btn btn-ghost btn-sm" style={{ flex: 1, padding: '4px' }}
                                                    onClick={() => setBetAmount(v)}>
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Estimated payout preview */}
                                    {betAmount && selectedOption !== null && (
                                        <div style={{
                                            padding: 'var(--space-4)',
                                            background: 'rgba(139,92,246,0.08)',
                                            border: '1px solid rgba(139,92,246,0.2)',
                                            borderRadius: 'var(--radius-md)',
                                            marginBottom: 'var(--space-5)',
                                            fontSize: '0.85rem',
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                                <span>Stake</span>
                                                <span>{betAmount} STX</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                                <span>Protocol fee</span>
                                                <span>~2%</span>
                                            </div>
                                            <hr className="divider" style={{ margin: 'var(--space-2) 0' }} />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--green-400)', fontWeight: 700 }}>
                                                <span>Estimated Payout</span>
                                                <span>💰 {estimatedPayout.toFixed(2)} STX</span>
                                            </div>
                                        </div>
                                    )}

                                    {!isConnected ? (
                                        <button className="btn btn-primary btn-lg w-full" onClick={connect}>
                                            <Wallet size={16} /> Connect Wallet to Bet
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary btn-lg w-full"
                                            onClick={handlePlaceBet}
                                            disabled={txPending || selectedOption === null || !betAmount}
                                        >
                                            {txPending
                                                ? <><div className="spinner" /> Confirming...</>
                                                : <><Zap size={15} fill="currentColor" /> Place Bet</>
                                            }
                                        </button>
                                    )}

                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-3)' }}>
                                        Funds locked in smart contract until resolution
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive fix for mobile */}
            <style>{`
        @media (max-width: 900px) {
          .event-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}

function InfoStat({ icon: Icon, label, value, color }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', padding: 'var(--space-3)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Icon size={11} /> {label}
            </div>
            <span style={{ color, fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{value}</span>
        </div>
    );
}

// Missing Wallet import
function Wallet({ size }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="12" />
        </svg>
    );
}
