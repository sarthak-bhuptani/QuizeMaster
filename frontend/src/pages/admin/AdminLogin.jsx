import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck, Terminal, Cpu } from 'lucide-react';

const AdminLogin = () => {
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
            const res = await api.post('/admin/login', formData);
            localStorage.setItem('admin', JSON.stringify(res.data));
            navigate('/admin-dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Unauthorized Access');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="auth-split-layout" style={{ flex: 1 }}>
                {/* Left Side - Visuals */}
                <div className="auth-left" style={{ background: 'radial-gradient(circle at center, rgba(153, 27, 27, 0.4) 0%, rgba(5, 5, 5, 1) 100%)' }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(var(--danger) 1px, transparent 1px), linear-gradient(90deg, var(--danger) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

                    <div className="auth-left-content">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}
                        >
                            <ShieldCheck size={40} className="text-danger" />
                        </motion.div>

                        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                            <span className="text-danger">Central</span> Command.
                        </h1>
                        <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '450px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                            Restricted management portal for QuizMaster core operations. Monitor systems, manage users, and secure the platform.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="glass" style={{ padding: '0.8rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <Terminal size={18} className="text-danger" />
                                <span style={{ fontSize: '0.9rem' }}>System Logs</span>
                            </div>
                            <div className="glass" style={{ padding: '0.8rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <Cpu size={18} className="text-danger" />
                                <span style={{ fontSize: '0.9rem' }}>Core Monitor</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-right">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="auth-form-card"
                    >
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, var(--danger), #991b1b)', borderRadius: '16px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}>
                                <ShieldCheck size={30} color="white" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin Secure</h2>
                            <p className="text-secondary">Enter your administrative credentials</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="bg-danger-soft"
                                style={{ padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem', textAlign: 'center' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
                                <User size={18} className="text-secondary" style={{ position: 'absolute', left: '1rem', top: '1.1rem', zIndex: 10 }} />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Admin Identifier"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '3rem', height: '50px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '2rem', position: 'relative' }}>
                                <Lock size={18} className="text-secondary" style={{ position: 'absolute', left: '1rem', top: '1.1rem', zIndex: 10 }} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Access Key"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '3rem', height: '50px' }}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="btn"
                                style={{ width: '100%', height: '50px', background: 'linear-gradient(135deg, var(--danger), #991b1b)', color: 'white', border: 'none', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Authenticate'} <ArrowRight size={20} />
                            </motion.button>
                        </form>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem' }} className="text-secondary">
                            Restricted access. All connection attempts are logged. <br />
                            Unauthorized entry is strictly prohibited.
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
