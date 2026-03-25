import { Brain, Twitter, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                <div className="footer-grid" style={gridStyle}>
                    {/* Brand */}
                    <div style={{ paddingRight: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={iconWrapperStyle}>
                                <Brain size={20} color="#fff" />
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>QuizMaster</span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            A simple, secure, and user-friendly platform for learning and assessments.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 style={headingStyle}>Product</h4>
                        <ul style={listStyle}>
                            <li><a href="#" style={linkStyle}>Features</a></li>
                            <li><a href="#" style={linkStyle}>Pricing</a></li>
                            <li><a href="#" style={linkStyle}>Teacher Portal</a></li>
                            <li><a href="#" style={linkStyle}>Student Access</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={headingStyle}>Resources</h4>
                        <ul style={listStyle}>
                            <li><a href="#" style={linkStyle}>Help Center</a></li>
                            <li><a href="#" style={linkStyle}>Documentation</a></li>
                            <li><a href="#" style={linkStyle}>Community Guidelines</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom" style={bottomStyle}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>&copy; 2024 QuizMaster <Link to="/admin/login" style={{ color: 'inherit', textDecoration: 'none', cursor: 'default' }}>Inc.</Link> All rights reserved.</p>
                    <div className="social-links" style={{ display: 'flex', gap: '1rem' }}>
                        <a href="https://x.com/Sarthak00125445" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}><Twitter size={18} /></a>
                        <a href="https://github.com/sarthak-bhuptani" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}><Github size={18} /></a>
                        <a href="https://www.linkedin.com/in/sarthak-bhuptani/" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}><Linkedin size={18} /></a>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
                    .footer-bottom { flex-direction: column !important; gap: 1rem !important; text-align: center; }
                    .social-links { justify-content: center; }
                }
            `}</style>
        </footer>
    );
};

const footerStyle = {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    padding: '4rem 0 2rem 0',
};

const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '4rem',
    marginBottom: '4rem',
};

const iconWrapperStyle = {
    backgroundColor: '#4f46e5',
    borderRadius: '8px',
    padding: '6px',
    display: 'flex',
};

const headingStyle = {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: '1.25rem',
};

const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
};

const linkStyle = {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.95rem',
};

const bottomStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '2rem',
    borderTop: '1px solid #e2e8f0',
};

const socialLinkStyle = {
    color: '#94a3b8',
    transition: 'color 0.2s',
};

export default Footer;
