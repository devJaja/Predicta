import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Lightbulb, Shield, Clock, Users, ChevronRight, Trash2, Plus } from 'lucide-react';
import { openContractCall } from '@stacks/connect';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { buildCreateEventOptions } from '../lib/contracts/core';

const CATEGORIES = ['Crypto', 'Sports', 'Politics', 'Finance', 'Technology', 'Entertainment', 'Other'];
const EXAMPLE_TITLES = [
    'Will Bitcoin reach $200K by end of 2025?',
    'Will Nigeria win the 2025 AFCON?',
    'Will the US Fed cut rates in Q2 2025?',
];

export default function CreateEvent() {
    const { isConnected, connect } = useWallet();
    const toast = useToast();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        category: 'Crypto',
        resolveDate: '',
        oracleThreshold: 3,
        options: ['Yes', 'No'],
    });
    const [txPending, setTxPending] = useState(false);
    const [step, setStep] = useState(1);

    const setField = (field, value) => setForm(f => ({ ...f, [field]: value }));

    const addOption = () => {
        if (form.options.length >= 10) return;
        setForm(f => ({ ...f, options: [...f.options, ''] }));
    };

    const removeOption = (i) => {
        if (form.options.length <= 2) return;
        setForm(f => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));
    };

    const updateOption = (i, val) => {
        setForm(f => {
            const opts = [...f.options];
            opts[i] = val;
            return { ...f, options: opts };
        });
    };

    const validate = () => {
        if (!form.title.trim()) return 'Please enter a market title';
        if (form.title.length > 256) return 'Title is too long (max 256 characters)';
        if (!form.resolveDate) return 'Please set a resolution date';
        if (form.options.some(o => !o.trim())) return 'All outcome options must be filled in';
        if (form.options.length < 2) return 'At least 2 outcomes are required';
        return null;
    };

    const handleSubmit = async () => {
        if (!isConnected) { connect(); return; }
        const err = validate();
        if (err) { toast.error(err); return; }

        // Calculate resolve block height (approx: ~144 blocks/day, 10 min/block)
        const now = Date.now();
        const resolveMs = new Date(form.resolveDate).getTime();
        const minutesUntil = (resolveMs - now) / 60000;
        const currentBlockApprox = 162000; // approximate — in prod fetch real block height
        const resolveBlock = Math.floor(currentBlockApprox + minutesUntil / 10);

        setTxPending(true);
        try {
            const opts = buildCreateEventOptions(
                form.title,
                form.options.length,
                resolveBlock,
                form.oracleThreshold
            );
            await openContractCall({
                ...opts,
                onFinish: (data) => {
                    toast.success(`Market created! TX: ${data.txId?.slice(0, 10)}...`);
                    setTxPending(false);
                    navigate('/');
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
            <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)', maxWidth: 760 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                    <div style={{
                        width: 60, height: 60,
                        background: 'var(--grad-primary)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto var(--space-5)',
                        boxShadow: 'var(--shadow-glow)',
                    }}>
                        <PlusCircle size={26} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 'var(--space-3)' }}>
                        Create a <span className="text-gradient">Prediction Market</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto' }}>
                        Define an outcome, set your resolution criteria, and let the market find the truth.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: 'var(--space-8)' }}>

                    {/* Step 1: Market Info */}
                    <SectionHeading icon={Lightbulb} title="Market Question" step={1} />

                    <div className="input-group">
                        <label className="input-label">Market Title *</label>
                        <textarea
                            className="input-field"
                            rows={2}
                            placeholder="Will Bitcoin reach $200K before end of 2025?"
                            value={form.title}
                            onChange={e => setField('title', e.target.value)}
                            style={{ resize: 'vertical', minHeight: 64 }}
                        />
                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                            {EXAMPLE_TITLES.map(t => (
                                <button key={t} className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                                    onClick={() => setField('title', t)}>
                                    Use: "{t.slice(0, 30)}..."
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                        <div className="input-group">
                            <label className="input-label">Category</label>
                            <select
                                className="input-field"
                                value={form.category}
                                onChange={e => setField('category', e.target.value)}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Resolution Date *</label>
                            <input
                                className="input-field"
                                type="datetime-local"
                                value={form.resolveDate}
                                onChange={e => setField('resolveDate', e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>
                    </div>

                    <hr className="divider" />

                    {/* Step 2: Outcomes */}
                    <SectionHeading icon={ChevronRight} title="Outcome Options" step={2} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'var(--space-5)' }}>
                        {form.options.map((opt, i) => {
                            const COLORS = ['#a78bfa', '#22d3ee', '#4ade80', '#fbbf24', '#f87171', '#fb923c'];
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 6,
                                        background: COLORS[i % COLORS.length] + '22',
                                        border: `1.5px solid ${COLORS[i % COLORS.length]}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: COLORS[i % COLORS.length],
                                    }}>
                                        {i + 1}
                                    </div>
                                    <input
                                        className="input-field"
                                        placeholder={`Option ${i + 1}`}
                                        value={opt}
                                        onChange={e => updateOption(i, e.target.value)}
                                        style={{ flex: 1, marginBottom: 0 }}
                                    />
                                    {form.options.length > 2 && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeOption(i)}
                                            style={{ padding: '6px 8px', flexShrink: 0 }}
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {form.options.length < 10 && (
                        <button className="btn btn-ghost btn-sm" onClick={addOption} style={{ gap: '5px', marginBottom: 'var(--space-5)' }}>
                            <Plus size={14} /> Add Outcome
                        </button>
                    )}

                    <hr className="divider" />

                    {/* Step 3: Oracle Config */}
                    <SectionHeading icon={Shield} title="Oracle Configuration" step={3} />

                    <div className="input-group">
                        <label className="input-label">Minimum Oracle Votes for Consensus</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <input
                                type="range"
                                min={1} max={7}
                                value={form.oracleThreshold}
                                onChange={e => setField('oracleThreshold', parseInt(e.target.value))}
                                style={{ flex: 1, accentColor: 'var(--purple-500)' }}
                            />
                            <div style={{
                                width: 48, height: 48,
                                background: 'var(--grad-primary)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                                color: '#fff', flexShrink: 0,
                            }}>
                                {form.oracleThreshold}
                            </div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {form.oracleThreshold} oracle vote{form.oracleThreshold > 1 ? 's' : ''} required to resolve this market.
                            Higher = more decentralized.
                        </p>
                    </div>

                    <hr className="divider" />

                    {/* Preview */}
                    <div style={{
                        padding: 'var(--space-5)',
                        background: 'rgba(139,92,246,0.06)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: 'var(--space-6)',
                    }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>Preview</p>
                        <h3 style={{ fontSize: '0.975rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
                            {form.title || 'Your market title will appear here...'}
                        </h3>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {form.options.map((opt, i) => (
                                <span key={i} style={{
                                    padding: '3px 10px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.78rem', fontWeight: 600,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)',
                                }}>
                                    {opt || `Option ${i + 1}`}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    {!isConnected ? (
                        <button className="btn btn-primary btn-lg w-full" onClick={connect}>
                            Connect Wallet to Create Market
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary btn-lg w-full"
                            onClick={handleSubmit}
                            disabled={txPending}
                        >
                            {txPending
                                ? <><div className="spinner" /> Creating Market...</>
                                : <><PlusCircle size={16} /> Create Prediction Market</>
                            }
                        </button>
                    )}

                    <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
                        Creating a market costs a small STX gas fee. The market will be live immediately.
                    </p>
                </div>
            </div>
        </div>
    );
}

function SectionHeading({ icon: Icon, title, step }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <div style={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))',
                border: '1px solid var(--border-glow)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Icon size={15} color="var(--purple-400)" />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h2>
            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {step} / 3
            </div>
        </div>
    );
}
