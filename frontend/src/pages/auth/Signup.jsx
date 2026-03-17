import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, MapPin, ArrowRight, GraduationCap, ArrowLeft, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = ({ userType }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        mobile: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Allow scrolling
        document.body.style.overflow = 'auto';
    }, []);

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
            const msg = err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-fullscreen-center">
            <div className="auth-bg-soft"></div>
            
            {/* Duplicate Brand Link removed as Navbar is now visible */}

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-card-v3 wider-signup"
            >
                <div className="auth-header-v3">
                    <div className="auth-icon-v3" style={{ background: '#eef2ff' }}>
                        <GraduationCap size={32} color="#4f46e5" />
                    </div>
                    <h2>Create Account</h2>
                    <p>Join QuizMaster and start your journey today.</p>
                </div>

                {error && <div className="auth-error-v3">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form-v3">
                    <div className="auth-grid-row">
                        <div className="auth-field-v3 flex-1">
                            <label>First Name</label>
                            <div className="auth-input-v3">
                                <input type="text" name="first_name" placeholder="John" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="auth-field-v3 flex-1">
                            <label>Last Name</label>
                            <div className="auth-input-v3">
                                <input type="text" name="last_name" placeholder="Doe" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="auth-field-v3">
                        <label>Email Address</label>
                        <div className="auth-input-v3">
                            <Mail size={18} className="auth-input-ico" />
                            <input type="email" name="email" placeholder="example@email.com" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="auth-grid-row">
                        <div className="auth-field-v3 flex-1">
                            <label>Username</label>
                            <div className="auth-input-v3">
                                <User size={18} className="auth-input-ico" />
                                <input type="text" name="username" placeholder="username" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="auth-field-v3 flex-1">
                            <label>Password</label>
                            <div className="auth-input-v3">
                                <Lock size={18} className="auth-input-ico" />
                                <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="auth-grid-row">
                        <div className="auth-field-v3 flex-1">
                            <label>Mobile Number</label>
                            <div className="auth-input-v3">
                                <Phone size={18} className="auth-input-ico" />
                                <input type="text" name="mobile" placeholder="Phone" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="auth-field-v3 flex-1">
                            <label>City / Address</label>
                            <div className="auth-input-v3">
                                <MapPin size={18} className="auth-input-ico" />
                                <input type="text" name="address" placeholder="City" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="auth-btn-v3" 
                        style={{ backgroundColor: '#4f46e5', marginTop: '1rem' }}
                    >
                        {loading ? "Registering..." : "Create Account"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-footer-v3">
                    <p>Already joined? <Link to="/student/login" style={{ color: '#4f46e5' }}>Login here</Link></p>
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
                    background-color: #f8fafc; font-family: 'Outfit', sans-serif;
                    padding: 120px 1rem 60px;
                }
                .auth-bg-soft { position: absolute; inset: 0; background-image: radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%); pointer-events: none; }
                .auth-card-v3 { background: white; width: 100%; max-width: 450px; padding: 2.5rem; border-radius: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; position: relative; z-index: 10; margin: auto; }
                .wider-signup { max-width: 520px; }
                .auth-header-v3 { text-align: center; margin-bottom: 2rem; }
                .auth-icon-v3 { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
                .auth-header-v3 h2 { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
                .auth-error-v3 { background: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center; font-size: 0.85rem; font-weight: 600; }
                .auth-form-v3 { display: flex; flex-direction: column; gap: 1.25rem; }
                .auth-grid-row { display: flex; gap: 1.25rem; }
                .flex-1 { flex: 1; }
                .auth-field-v3 label { font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; display: block; }
                .auth-input-v3 { position: relative; }
                .auth-input-ico { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #cbd5e1; }
                .auth-input-v3 input { width: 100%; padding: 0.85rem 1rem; border-radius: 14px; border: 1.5px solid #e2e8f0; background: #f8fafc; font-size: 1rem; box-sizing: border-box; transition: all 0.2s; }
                .auth-input-v3 .auth-input-ico + input { padding-left: 3rem; }
                .auth-input-v3 input:focus { border-color: #4f46e5; background: white; outline: none; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
                .auth-btn-v3 { padding: 1.1rem; border-radius: 16px; color: white; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1.1rem; transition: all 0.2s; }
                .auth-btn-v3:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }
                .auth-footer-v3 { text-align: center; margin-top: 2rem; color: #64748b; }
                .auth-footer-v3 a { text-decoration: none; font-weight: 700; }
                @media (max-width: 600px) {
                    .auth-fullscreen-center { padding: 90px 0.75rem 40px; }
                    .auth-grid-row { flex-direction: column; gap: 1.25rem; }
                    .auth-header-v3 h2 { font-size: 1.5rem; }
                    .auth-card-v3 { padding: 2rem 1.25rem; border-radius: 20px; width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default Signup;
