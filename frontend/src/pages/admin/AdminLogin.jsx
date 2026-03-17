import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
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
            localStorage.setItem('admin', JSON.stringify(res.data));
            navigate('/admin-dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Access Denied: Restricted Area');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-fullscreen-center">
            <div className="auth-bg-soft admin-gradient"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card-v3 admin-border"
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
                .auth-fullscreen-center {
                    position: relative;
                    min-height: 100vh;
                    display: flex; align-items: center; justify-content: center;
                    background-color: #f1f5f9; font-family: 'Outfit', sans-serif;
                    padding: 120px 1rem 40px;
                }
                .auth-bg-soft {
                    position: absolute; inset: 0;
                    background-image: radial-gradient(at 0% 0%, rgba(15, 23, 42, 0.05) 0px, transparent 50%),
                                      radial-gradient(at 100% 100%, rgba(15, 23, 42, 0.05) 0px, transparent 50%);
                    pointer-events: none;
                }
                .admin-gradient {
                    background-color: #0f172a;
                    background-image: radial-gradient(circle at 50% 50%, rgba(51, 65, 85, 0.4) 0%, transparent 100%);
                }
                .auth-card-v3 {
                    background: white; width: 100%; max-width: 400px;
                    padding: 2.5rem 2rem; border-radius: 24px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e2e8f0; position: relative; z-index: 10;
                }
                .admin-border {
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .auth-header-v3 { text-align: center; margin-bottom: 1.5rem; }
                .auth-icon-v3 { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
                .auth-header-v3 h2 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; }
                .auth-header-v3 p { color: #64748b; font-size: 0.9rem; }
                
                .auth-error-v3 {
                    background: #fff1f2; color: #e11d48; padding: 0.75rem; border-radius: 12px; margin-bottom: 1.5rem;
                    text-align: center; font-size: 0.85rem; font-weight: 600; border: 1px solid #ffe4e6;
                }
                .auth-form-v3 { display: flex; flex-direction: column; gap: 1.5rem; }
                .auth-field-v3 label { font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; display: block; }
                
                .auth-input-v3 { position: relative; }
                .auth-input-ico { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
                .auth-input-v3 input {
                    width: 100%; padding: 0.85rem 1rem 0.85rem 3rem; border-radius: 12px;
                    border: 1.5px solid #e2e8f0; background: #f8fafc; font-size: 1rem;
                    box-sizing: border-box; transition: all 0.2s;
                }
                .auth-input-v3 input:focus { border-color: #0f172a; background: white; outline: none; }
                
                .auth-btn-v3 {
                    padding: 1rem; border-radius: 12px; color: white; font-weight: 700;
                    border: none; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 8px; margin-top: 0.5rem; font-size: 1rem;
                }
                .auth-footer-v3 { text-align: center; margin-top: 1.5rem; color: #64748b; font-size: 0.9rem; }
                .auth-footer-v3 a { text-decoration: none; font-weight: 700; }
                @media (max-width: 480px) {
                    .auth-fullscreen-center { padding: 90px 0.75rem 40px; }
                    .auth-card-v3 { padding: 2rem 1.25rem; border-radius: 20px; width: 100%; max-width: none; }
                    .auth-header-v3 h2 { font-size: 1.3rem; }
                    .auth-form-v3 { gap: 1.25rem; }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
