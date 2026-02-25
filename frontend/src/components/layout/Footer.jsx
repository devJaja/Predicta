import React from 'react';
import { Zap, Twitter, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border)',
            padding: 'var(--space-10) 0 var(--space-8)',
            marginTop: 'auto',
            background: 'rgba(8,11,20,0.8)',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            zIndex: 1,
        }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-4)' }}>
                            <div style={{
                                width: 32, height: 32,
                                background: 'var(--grad-primary)',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Zap size={15} color="white" fill="white" />
                            </div>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>
                                Predict<span className="text-gradient">a</span>
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 220 }}>
                            Decentralized prediction markets secured by Bitcoin via the Stacks blockchain.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>Platform</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[['/', 'Explore Markets'], ['/create', 'Create Market'], ['/leaderboard', 'Leaderboard'], ['/profile', 'My Profile']].map(([to, label]) => (
                                <Link key={to} to={to} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = 'var(--purple-400)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>Resources</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                ['https://docs.hiro.so', 'Hiro Docs'],
                                ['https://explorer.hiro.so', 'Block Explorer'],
                                ['https://book.clarity-lang.org', 'Clarity Book'],
                            ].map(([href, label]) => (
                                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan-400)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    {label} <ExternalLink size={11} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        © 2025 Predicta · Built on Stacks · MIT License
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            <Github size={18} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan-400)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            <Twitter size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
