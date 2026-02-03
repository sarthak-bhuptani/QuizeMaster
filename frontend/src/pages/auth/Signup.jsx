import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, MapPin, Phone, ArrowRight, GraduationCap, Sparkles, Orbit } from 'lucide-react';
import Footer from '../../components/Footer';

const Signup = ({ userType }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        mobile: '',
        address: ''
    });
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
            const endpoint = userType === 'student' ? '/student/signup' : '/teacher/signup';
            const res = await api.post(endpoint, formData);
            alert(res.data.message);
            navigate(userType === 'student' ? '/student/login' : '/teacher/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '85px' }}>
            <div className="auth-split-layout" style={{ flex: 1, display: 'flex' }}>

                {/* Visual Section - Quantum Journey Style */}
                <div className="auth-left" style={{
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle at 70% 70%, #1e1b4b 0%, #020617 100%)',
                    padding: '4rem'
                }}>
                    {/* Animated Particles */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', top: '15%', right: '10%', opacity: 0.1 }}
                    >
                        <Orbit size={400} color="#818cf8" />
                    </motion.div>

                    <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#ec4899', boxShadow: '0 0 15px rgba(236, 72, 153, 0.5)' }}></div>
                                <span style={{ color: '#ec4899', fontWeight: '900', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                    Initialization
                                </span>
                            </div>

                            <h1 style={{ fontSize: '4.5rem', fontWeight: '950', color: 'white', lineHeight: 1, letterSpacing: '-0.05em', marginBottom: '2rem' }}>
                                Your <span style={{ color: '#ec4899' }}>Quest</span> <br />
                                Starts Here.
                            </h1>

                            <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '3.5rem', maxWidth: '500px' }}>
                                Join an ecosystem of elite learners. Create your profile to unlock high-fidelity exam simulations and real-time performance tracking.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {[
                                    { label: 'Active Learners', val: '12K+' },
                                    { label: 'Certifications', val: '450+' },
                                    { label: 'Success Rate', val: '99%' }
                                ].map((stat, i) => (
                                    <div key={i} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', marginBottom: '0.25rem' }}>{stat.val}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Form Section - Clean Glass Architecture */}
                <div className="auth-right" style={{
                    flex: '0 0 700px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#020617',
                    padding: '3rem'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ width: '100%', maxWidth: '550px' }}
                    >
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', marginBottom: '0.5rem' }}>Create Account</h2>
                            <p style={{ color: '#64748b', fontWeight: '500' }}>Populate your identity across the network</p>
                        </div>

                        {error && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '16px', color: '#f87171', fontSize: '0.9rem', marginBottom: '2rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>First Name</label>
                                    <input type="text" name="first_name" placeholder="John" onChange={handleChange} required style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Last Name</label>
                                    <input type="text" name="last_name" placeholder="Doe" onChange={handleChange} required style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Username</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} color="#475569" style={{ position: 'absolute', left: '1.25rem', top: '1.1rem' }} />
                                    <input type="text" name="username" placeholder="johndoe_elite" onChange={handleChange} required style={{ ...inputStyle, paddingLeft: '3.5rem' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Secure Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} color="#475569" style={{ position: 'absolute', left: '1.25rem', top: '1.1rem' }} />
                                    <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required style={{ ...inputStyle, paddingLeft: '3.5rem' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                                <div>
                                    <label style={labelStyle}>Mobile Connection</label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} color="#475569" style={{ position: 'absolute', left: '1.25rem', top: '1.1rem' }} />
                                        <input type="text" name="mobile" placeholder="+1 (000) 000-0000" onChange={handleChange} required style={{ ...inputStyle, paddingLeft: '3.5rem' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Current Location</label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={18} color="#475569" style={{ position: 'absolute', left: '1.25rem', top: '1.1rem' }} />
                                        <input type="text" name="address" placeholder="San Francisco, CA" onChange={handleChange} style={{ ...inputStyle, paddingLeft: '3.5rem' }} />
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01, background: '#4f46e5' }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '1.1rem',
                                    borderRadius: '16px',
                                    background: '#6366f1',
                                    border: 'none',
                                    color: 'white',
                                    fontWeight: '900',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)'
                                }}
                            >
                                {loading ? 'Processing Identity...' : 'Initialize Account'}
                                <Sparkles size={18} />
                            </motion.button>
                        </form>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                Already verified? {' '}
                                <Link to={`/${userType}/login`} style={{ color: '#ec4899', fontWeight: '800', textDecoration: 'none' }}>Authenticate Now</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style>{`
                @media (max-width: 1280px) {
                    .auth-left { display: none !important; }
                    .auth-right { flex: 1 !important; width: 100% !important; }
                }
            `}</style>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
    letterSpacing: '0.05em'
};

const inputStyle = {
    width: '100%',
    padding: '1rem 1.25rem',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'white',
    outline: 'none',
    fontSize: '0.95rem',
    transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    '&:focus': {
        borderColor: '#818cf8',
        background: 'rgba(255,255,255,0.05)'
    }
};

export default Signup;
