import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
import Footer from '../../components/Footer';
import LiveBackground from '../../components/LiveBackground';

const Login = ({ userType }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = userType === 'student' ? '/student/login' : '/teacher/login';
            const res = await api.post(endpoint, formData);
            localStorage.setItem('user', JSON.stringify(res.data));

            if (userType === 'student') {
                navigate('/student-dashboard');
            } else {
                navigate('/teacher-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '85px' }}>
            <div className="auth-split-layout" style={{ flex: 1, display: 'flex' }}>

                {/* Visual Section - Quantum Obsidian Style */}
                <div className="auth-left" style={{
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle at 30% 30%, #1e1b4b 0%, #020617 100%)',
                    padding: '4rem'
                }}>
                    <LiveBackground />
                    {/* Animated Background Elements */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'rgba(99, 102, 241, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }}
                    />

                    <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '0.8rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                    <GraduationCap size={32} color="#818cf8" />
                                </div>
                                <span style={{ color: '#818cf8', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                                    {userType} Portal
                                </span>
                            </div>

                            <h1 style={{ fontSize: '4rem', fontWeight: '950', color: 'white', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '2rem' }}>
                                Welcome back <br />
                                to the <span style={{ color: '#818cf8' }}>Future</span>.
                            </h1>

                            <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: 1.6, marginBottom: '3rem' }}>
                                {userType === 'student'
                                    ? "Access your personal dashboard, review your performance metrics, and continue your journey toward mastery."
                                    : "Management tools for elite educators. Organize courses, analyze results, and drive student success."
                                }
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                {[
                                    { icon: <ShieldCheck size={18} />, text: 'Secure Access' },
                                    { icon: <Sparkles size={18} />, text: 'Cloud Analytics' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white', fontWeight: '600', fontSize: '0.9rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span style={{ color: '#818cf8' }}>{item.icon}</span>
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Form Section - Architectural Glass Style */}
                <div className="auth-right" style={{
                    flex: '0 0 550px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#020617',
                    padding: '2rem'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ width: '100%', maxWidth: '420px' }}
                    >
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Login</h2>
                            <p style={{ color: '#64748b', fontWeight: '500' }}>Enter your credentials to continue</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '16px', color: '#f87171', fontSize: '0.9rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                            >
                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444' }}></div>
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Username</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} color="#475569" style={{ position: 'absolute', left: '1.25rem', top: '1.1rem' }} />
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Identification"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} color="#475569" style={{ position: 'absolute', left: '1.25rem', top: '1.1rem' }} />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Access Key"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '1.1rem',
                                    borderRadius: '16px',
                                    background: '#6366f1',
                                    border: 'none',
                                    color: 'white',
                                    fontWeight: '800',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                {loading ? 'Authorizing...' : 'Authorize Access'}
                                <ArrowRight size={20} />
                            </motion.button>
                        </form>

                        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                            {userType === 'student' ? (
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                    No account yet? {' '}
                                    <Link to="/student/signup" style={{ color: '#818cf8', fontWeight: '700', textDecoration: 'none' }}>Initialize Journey</Link>
                                </p>
                            ) : (
                                <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.6 }}>
                                    Teacher accounts are strictly managed. <br />
                                    Direct registration is disabled.
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .auth-left { display: none !important; }
                    .auth-right { flex: 1 !important; width: 100% !important; }
                }
            `}</style>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '1rem 1.25rem 1rem 3.5rem',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'white',
    outline: 'none',
    fontSize: '0.95rem',
    transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)'
};

export default Login;
