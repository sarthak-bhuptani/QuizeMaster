import { Brain } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-grid">
                    {/* Column 1: Brand & Slogan */}
                    <div className="footer-column-brand">
                        <div className="footer-logo">
                            <div className="footer-logo-icon">
                                <Brain size={24} color="#ffffff" />
                            </div>
                            QuizeMaster
                        </div>
                        <p className="footer-desc">
                            Building the world's most advanced collective brain through interactive
                            learning and competitive assessment.
                        </p>
                    </div>

                    {/* Column 2: Platform */}
                    <div className="footer-column">
                        <h4 className="footer-header">PLATFORM</h4>
                        <ul className="footer-links">
                            {['Browse Quizzes', 'Categories', 'Live Events', 'Leaderboards'].map(link => (
                                <li key={link}><a href="#">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div className="footer-column">
                        <h4 className="footer-header">RESOURCES</h4>
                        <ul className="footer-links">
                            {['Help Center', 'API Docs', 'Teacher Portal', 'Community'].map(link => (
                                <li key={link}><a href="#">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="footer-copyright">
                        © 2024 QuizeMaster Inc.
                    </div>
                    <div className="footer-socials">
                        {['Twitter', 'GitHub', 'LinkedIn'].map(social => (
                            <a key={social} href="#">{social}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
