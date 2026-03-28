import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('admin');
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/admin/login', formData);
            sessionStorage.setItem('admin', JSON.stringify(res.data));
            navigate('/admin-dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Access Denied: Restricted Area');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-photo-layout">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="auth-marketing-content"
            >
                <h1>Central Management Command</h1>
                <p>Secure administrative access to oversee students, teachers, and platform operations.</p>
                <ul className="auth-feature-list">
                    <li className="auth-feature-item">
                        <div className="auth-feature-icon" style={{ background: '#0f172a' }}><Check size={14} strokeWidth={3} /></div>
                        System-wide Course Management
                    </li>
                    <li className="auth-feature-item">
                        <div className="auth-feature-icon" style={{ background: '#0f172a' }}><Check size={14} strokeWidth={3} /></div>
                        Full User and Content Moderation
                    </li>
                    <li className="auth-feature-item">
                        <div className="auth-feature-icon" style={{ background: '#0f172a' }}><Check size={14} strokeWidth={3} /></div>
                        Deep Platform Statistics & Insights
                    </li>
                </ul>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="auth-form-card"
            >
                <div className="auth-header-v3">
                    <div className="auth-icon-v3" style={{ background: '#f1f5f9' }}>
                        <ShieldCheck size={32} color="#0f172a" />
                    </div>
                    <h2>Admin Portal</h2>
                    <p>Enter administrative credentials to proceed</p>
                </div>

                {error && <div className="auth-error-v3">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form-v3">
                    <div className="auth-field-v3">
                        <label>Admin Email / ID</label>
                        <div className="auth-input-v3">
                            <Mail size={18} className="auth-input-ico" />
                            <input 
                                type="text" 
                                name="email" 
                                placeholder="Admin ID or Email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="auth-field-v3">
                        <label>Secret Key</label>
                        <div className="auth-input-v3">
                            <Lock size={18} className="auth-input-ico" />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="••••••••" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="auth-btn-v3" 
                        style={{ backgroundColor: '#0f172a' }}
                    >
                        {loading ? "Verifying..." : "Unlock Dashboard"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-footer-v3">
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                        <Link to="/" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                            <ArrowLeft size={14} /> Back to Home
                        </Link>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .auth-photo-layout {
                    flex: 1;
                    min-height: 100vh;
                    background-image: url('/auth-bg-light.png');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: calc(70px + 4vh) 8vw 4vh;
                    font-family: 'Inter', 'Outfit', sans-serif;
                    overflow: hidden;
                    gap: 3rem;
                }
                
                .auth-marketing-content { flex: 1; max-width: 500px; color: #0f172a; align-self: center; }
                .auth-marketing-content h1 { font-size: 3.25rem; font-weight: 800; line-height: 1.15; margin-bottom: 1.25rem; color: #0f172a; letter-spacing: -1px; text-shadow: 0 4px 20px rgba(255,255,255,0.7); }
                .auth-marketing-content p { font-size: 1.1rem; color: #475569; line-height: 1.6; margin-bottom: 2rem; font-weight: 500; }
                .auth-feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
                .auth-feature-item { display: flex; align-items: center; gap: 1rem; font-size: 1.05rem; font-weight: 600; color: #1e293b; background: rgba(255,255,255,0.4); padding: 0.5rem 1rem 0.5rem 0.5rem; border-radius: 50px; width: fit-content; backdrop-filter: blur(4px); }
                .auth-feature-icon { width: 26px; height: 26px; border-radius: 50%; color: #ffffff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

                .auth-form-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    width: 100%;
                    max-width: 400px;
                    padding: 2rem;
                    border-radius: 16px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    color: #0f172a;
                    height: auto;
                    overflow: visible;
                }
                
                .auth-header-v3 { text-align: left; margin-bottom: 1.5rem; }
                .auth-icon-v3 { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
                .auth-header-v3 h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem; }
                .auth-header-v3 p { color: #64748b; font-size: 0.85rem; }
                
                .auth-error-v3 {
                    background: #fee2e2; color: #b91c1c; padding: 0.6rem; border-radius: 6px; margin-bottom: 1rem;
                    text-align: left; font-size: 0.8rem; font-weight: 600; border: 1px solid #fecaca;
                }
                .auth-form-v3 { display: flex; flex-direction: column; gap: 1rem; }
                .auth-field-v3 label { font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; display: block; text-transform: none; }
                
                .auth-input-v3 { position: relative; }
                .auth-input-ico { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
                .auth-input-v3 input {
                    width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem; border-radius: 6px;
                    border: 1px solid #cbd5e1; background: #f8fafc; color: #0f172a; font-size: 0.9rem;
                    box-sizing: border-box; transition: all 0.2s;
                }
                .auth-input-v3 input:focus { border-color: #0f172a; background: #ffffff; box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1); outline: none; }
                
                .auth-btn-v3 {
                    padding: 0.8rem; border-radius: 6px; color: #ffffff; font-weight: 700;
                    border: none; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 8px; margin-top: 0.5rem; font-size: 0.95rem;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.15);
                }
                .auth-btn-v3:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 6px 15px -3px rgba(0, 0, 0, 0.2); }
                .auth-footer-v3 { text-align: left; margin-top: 1.5rem; color: #64748b; font-size: 0.85rem; }
                .auth-footer-v3 > div > a { color: #64748b !important; }
                .auth-footer-v3 > div > a:hover { color: #0f172a !important; transition: color 0.2s; }
                
                @media (max-width: 1000px) {
                    .auth-photo-layout { justify-content: center; padding: calc(70px + 1.5rem) 1rem 2rem; overflow-y: auto; align-items: center; }
                    .auth-marketing-content { display: none; }
                    .auth-form-card { max-width: 100%; border-radius: 12px; margin-top: 0; }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
