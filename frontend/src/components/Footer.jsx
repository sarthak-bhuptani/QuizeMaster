import { Brain } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            padding: '10rem 5% 4rem',
            background: '#020617',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            zIndex: 1
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '6rem',
                    marginBottom: '8rem'
                }}>
                    {/* Column 1: Brand & Slogan */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '950', color: '#ffffff', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: '#6366f1', padding: '14px', borderRadius: '18px' }}>
                                <Brain size={36} color="#ffffff" />
                            </div>
                            QuizMaster
                        </div>
                        <p style={{ color: '#64748b', maxWidth: '380px', lineHeight: 1.8, fontSize: '1.2rem' }}>
                            Building the world's most advanced collective brain through interactive
                            learning and competitive assessment.
                        </p>
                    </div>

                    {/* Column 2: Platform */}
                    <div>
                        <h4 style={{ color: '#ffffff', marginBottom: '2.5rem', fontSize: '1.3rem', fontWeight: '800' }}>PLATFORM</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {['Browse Quizzes', 'Categories', 'Live Events', 'Leaderboards'].map(link => (
                                <li key={link}><a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '1.1rem' }}>{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 style={{ color: '#ffffff', marginBottom: '2.5rem', fontSize: '1.3rem', fontWeight: '800' }}>RESOURCES</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {['Help Center', 'API Docs', 'Teacher Portal', 'Community'].map(link => (
                                <li key={link}><a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '1.1rem' }}>{link}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                    <div style={{ color: '#475569', fontSize: '1rem', fontWeight: '600' }}>
                        © 2024 QuizMaster Inc.
                    </div>
                    <div style={{ display: 'flex', gap: '3rem' }}>
                        {['Twitter', 'GitHub', 'LinkedIn'].map(social => (
                            <a key={social} href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '1rem', fontWeight: '700' }}>{social}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
