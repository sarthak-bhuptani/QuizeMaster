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
        <div className="perfect-center-container admin-bg-center">
            {/* Background pattern */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', background: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-card-simple admin-card-border"
            >
                <div className="auth-card-header">
                    <div className="auth-icon-circle" style={{ background: '#f8fafc' }}>
                        <ShieldCheck size={32} color="#0f172a" />
                    </div>
                    <h1>Admin Login</h1>
                    <p>Enter administrative credentials to proceed.</p>
                </div>

                {error && <div className="auth-error-msg admin-err-msg">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form-simple">
                    <div className="auth-input-group">
                        <label>Admin Email / ID</label>
                        <div className="auth-input-field">
                            <Mail size={18} className="auth-input-icon" />
                            <input 
                                type="text" 
                                name="email" 
                                placeholder="admin or admin@quizmaster.com" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label>Secret Key</label>
                        <div className="auth-input-field">
                            <Lock size={18} className="auth-input-icon" />
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
                        className="auth-main-btn admin-solid-btn"
                    >
                        {loading ? "Verifying..." : "Unlock Dashboard"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-card-footer">
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                        <Link to="/" style={{ color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                            <ArrowLeft size={14} /> Back to Home
                        </Link>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .perfect-center-container {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #0f172a;
                    padding: 120px 1rem 40px;
                    font-family: 'Inter', sans-serif;
                }
                .admin-bg-center {
                    background-color: #0f172a;
                    background-image: radial-gradient(circle at 50% 50%, rgba(51, 65, 85, 0.4) 0%, transparent 100%);
                }
                .auth-card-simple {
                    background: white;
                    width: 100%;
                    max-width: 400px;
                    padding: 2.5rem 2rem;
                    border-radius: 20px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    position: relative;
                    z-index: 10;
                }
                .admin-card-border {
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .auth-card-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .auth-icon-circle {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                }
                .auth-card-header h1 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 0.5rem;
                }
                .auth-card-header p {
                    color: #64748b;
                    font-size: 0.9rem;
                }
                .admin-err-msg {
                    background-color: #fee2e2;
                    color: #b91c1c;
                    padding: 0.75rem;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 1.5rem;
                    border: 1px solid #fecaca;
                }
                .auth-form-simple {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .auth-input-group label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #475569;
                    margin-bottom: 0.4rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .auth-input-field {
                    position: relative;
                }
                .auth-input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                }
                .auth-input-field input {
                    width: 100%;
                    padding: 0.9rem 1rem 0.9rem 3.2rem;
                    border-radius: 12px;
                    border: 2px solid #f1f5f9;
                    background-color: #f8fafc;
                    font-size: 1rem;
                    box-sizing: border-box;
                    transition: all 0.2s;
                }
                .auth-input-field input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background-color: white;
                }
                .admin-solid-btn {
                    padding: 1rem;
                    background-color: #0f172a !important;
                    border-radius: 12px;
                    color: white;
                    font-weight: 800;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-size: 1rem;
                }
                .auth-card-footer {
                    text-align: center;
                    margin-top: 1.5rem;
                    font-size: 0.9rem;
                    color: #64748b;
                }
                @media (max-width: 480px) {
                    .perfect-center-container { padding: 90px 0.75rem 40px; }
                    .auth-card-simple { padding: 2rem 1.25rem; border-radius: 20px; width: 100%; max-width: none; }
                    .auth-card-header h1 { font-size: 1.3rem; }
                    .auth-form-simple { gap: 1.25rem; }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
