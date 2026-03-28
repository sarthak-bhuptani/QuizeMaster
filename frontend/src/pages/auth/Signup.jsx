import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, MapPin, ArrowRight, GraduationCap, ArrowLeft, Check } from 'lucide-react';
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
        <div className="auth-photo-layout">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="auth-marketing-content"
            >
                <h1>Master Your Knowledge with QuizMaster</h1>
                <p>The ultimate platform for creating, taking, and analyzing interactive educational assessments.</p>
                <ul className="auth-feature-list">
                    <li className="auth-feature-item">
                        <div className="auth-feature-icon"><Check size={14} strokeWidth={3} /></div>
                        AI-Powered Question Generation
                    </li>
                    <li className="auth-feature-item">
                        <div className="auth-feature-icon"><Check size={14} strokeWidth={3} /></div>
                        Real-time Analytics & Exam Tracking
                    </li>
                    <li className="auth-feature-item">
                        <div className="auth-feature-icon"><Check size={14} strokeWidth={3} /></div>
                        Gamified Student Dashboard Experience
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
                    <div className="auth-icon-v3" style={{ background: '#eef2ff' }}>
                        <GraduationCap size={20} color="#4f46e5" />
                    </div>
                    <div>
                        <h2>Create Account</h2>
                        <p>Join QuizMaster and start your journey today.</p>
                    </div>
                </div>

                {error && <div className="auth-error-v3">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form-v3">
                    <div className="auth-grid-row">
                        <div className="auth-field-v3 flex-1">
                            <label>First Name</label>
                            <div className="auth-input-v3">
                                <User size={18} className="auth-input-ico" />
                                <input type="text" name="first_name" placeholder="John" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="auth-field-v3 flex-1">
                            <label>Last Name</label>
                            <div className="auth-input-v3">
                                <User size={18} className="auth-input-ico" />
                                <input type="text" name="last_name" placeholder="Doe" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="auth-grid-row">
                        <div className="auth-field-v3 flex-1">
                            <label>Email Address</label>
                            <div className="auth-input-v3">
                                <Mail size={18} className="auth-input-ico" />
                                <input type="email" name="email" placeholder="email@example.com" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="auth-field-v3 flex-1">
                            <label>Mobile Number</label>
                            <div className="auth-input-v3">
                                <Phone size={18} className="auth-input-ico" />
                                <input type="text" name="mobile" placeholder="Phone" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="auth-grid-row">
                        <div className="auth-field-v3 flex-1">
                            <label>Username</label>
                            <div className="auth-input-v3">
                                <User size={18} className="auth-input-ico" />
                                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
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

                    <div className="auth-field-v3">
                        <label>City / Address</label>
                        <div className="auth-input-v3">
                            <MapPin size={18} className="auth-input-ico" />
                            <input type="text" name="address" placeholder="Enter your city" onChange={handleChange} />
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
                    <div style={{ marginTop: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                        <Link to="/" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
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
                    padding: calc(70px + 2vh) 8vw 2vh;
                    font-family: 'Inter', 'Outfit', sans-serif;
                    overflow: hidden;
                    gap: 3rem;
                }
                
                .auth-marketing-content { flex: 1; max-width: 500px; color: #0f172a; align-self: center; }
                .auth-marketing-content h1 { font-size: 3.25rem; font-weight: 800; line-height: 1.15; margin-bottom: 1.25rem; color: #0f172a; letter-spacing: -1px; text-shadow: 0 4px 20px rgba(255,255,255,0.7); }
                .auth-marketing-content p { font-size: 1.1rem; color: #475569; line-height: 1.6; margin-bottom: 2rem; font-weight: 500; }
                .auth-feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
                .auth-feature-item { display: flex; align-items: center; gap: 1rem; font-size: 1.05rem; font-weight: 600; color: #1e293b; background: rgba(255,255,255,0.4); padding: 0.5rem 1rem 0.5rem 0.5rem; border-radius: 50px; width: fit-content; backdrop-filter: blur(4px); }
                .auth-feature-icon { width: 26px; height: 26px; border-radius: 50%; background: #4f46e5; color: #ffffff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

                .auth-form-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    width: 100%;
                    max-width: 520px;
                    padding: 2rem 2.5rem;
                    border-radius: 16px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    color: #0f172a;
                    height: auto;
                    max-height: calc(100vh - 100px);
                    overflow-y: auto;
                    align-self: center;
                }
                .auth-form-card::-webkit-scrollbar { width: 6px; }
                .auth-form-card::-webkit-scrollbar-track { background: transparent; }
                .auth-form-card::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
                
                .auth-header-v3 { text-align: left; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; }
                .auth-icon-v3 { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .auth-header-v3 h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.15rem; }
                .auth-header-v3 p { color: #64748b; font-size: 0.85rem; margin: 0; }
                
                .auth-error-v3 {
                    background: #fee2e2; color: #b91c1c; padding: 0.6rem; border-radius: 6px; margin-bottom: 1rem;
                    text-align: left; font-size: 0.8rem; font-weight: 600; border: 1px solid #fecaca;
                }
                .auth-form-v3 { display: flex; flex-direction: column; gap: 1rem; }
                .auth-grid-row { display: flex; gap: 1rem; }
                .flex-1 { flex: 1; min-width: 0; }
                
                .auth-field-v3 label { font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem; display: block; text-transform: none; }
                
                .auth-input-v3 { position: relative; }
                .auth-input-ico { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
                .auth-input-v3 input {
                    width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem; border-radius: 8px;
                    border: 1px solid #cbd5e1; background: #f8fafc; color: #0f172a; font-size: 0.9rem;
                    box-sizing: border-box; transition: all 0.2s;
                }
                .auth-input-v3 input:focus { border-color: #4f46e5; background: #ffffff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); outline: none; }
                
                .auth-btn-v3 {
                    padding: 0.85rem; border-radius: 8px; color: #ffffff; font-weight: 700;
                    border: none; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 8px; margin-top: 0.5rem; font-size: 1rem;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.15);
                }
                .auth-btn-v3:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 6px 15px -3px rgba(0, 0, 0, 0.2); }
                .auth-footer-v3 { text-align: left; margin-top: 1.25rem; color: #64748b; font-size: 0.85rem; }
                .auth-footer-v3 a { text-decoration: none; font-weight: 700; transition: opacity 0.2s; }
                .auth-footer-v3 a:hover { opacity: 0.8; }
                .auth-footer-v3 > div > a { color: #64748b !important; }
                .auth-footer-v3 > div > a:hover { color: #0f172a !important; }
                
                @media (max-width: 1000px) {
                    .auth-photo-layout { justify-content: center; padding: calc(70px + 1.5rem) 1rem 2rem; overflow-y: auto; align-items: center; }
                    .auth-marketing-content { display: none; }
                    .auth-form-card { max-width: 100%; border-radius: 12px; margin-top: 0; }
                    .auth-grid-row { flex-direction: column; gap: 0.85rem; }
                }
                @media (max-height: 700px) {
                    .auth-photo-layout { align-items: flex-start; }
                }
            `}</style>
        </div>
    );
};

export default Signup;
