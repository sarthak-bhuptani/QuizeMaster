import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, MapPin, ArrowRight, GraduationCap, ArrowLeft } from 'lucide-react';
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
        <div className="perfect-center-container scrollable-auth">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-card-simple signup-wider"
            >
                <div className="auth-card-header">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className="auth-icon-circle" style={{ background: '#eef2ff', cursor: 'pointer' }}>
                            <GraduationCap size={32} color="#4f46e5" />
                        </div>
                    </Link>
                    <h1>Create Account</h1>
                    <p>Join QuizMaster and start your journey today.</p>
                </div>

                {error && <div className="auth-error-msg">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form-simple">
                    <div className="auth-grid-row">
                        <div className="auth-input-group flex-1">
                            <label>First Name</label>
                            <input type="text" name="first_name" placeholder="John" onChange={handleChange} required className="auth-plain-input" />
                        </div>
                        <div className="auth-input-group flex-1">
                            <label>Last Name</label>
                            <input type="text" name="last_name" placeholder="Doe" onChange={handleChange} required className="auth-plain-input" />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label>Email Address</label>
                        <div className="auth-input-field">
                            <Mail size={18} className="auth-input-icon" />
                            <input type="email" name="email" placeholder="example@email.com" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="auth-grid-row">
                        <div className="auth-input-group flex-1">
                            <label>Username</label>
                            <div className="auth-input-field">
                                <User size={18} className="auth-input-icon" />
                                <input type="text" name="username" placeholder="username" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="auth-input-group flex-1">
                            <label>Password</label>
                            <div className="auth-input-field">
                                <Lock size={18} className="auth-input-icon" />
                                <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="auth-grid-row">
                        <div className="auth-input-group flex-1">
                            <label>Mobile Number</label>
                            <div className="auth-input-field">
                                <Phone size={18} className="auth-input-icon" />
                                <input type="text" name="mobile" placeholder="Phone" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="auth-input-group flex-1">
                            <label>City / Address</label>
                            <div className="auth-input-field">
                                <MapPin size={18} className="auth-input-icon" />
                                <input type="text" name="address" placeholder="City" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="auth-main-btn" 
                        style={{ backgroundColor: '#4f46e5', marginTop: '1rem' }}
                    >
                        {loading ? "Registering..." : "Create Account"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-card-footer">
                    <p>Already joined? <Link to="/student/login">Login here</Link></p>
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                        <Link to="/" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                            <ArrowLeft size={14} /> Back to Home
                        </Link>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .perfect-center-container {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f8fafc;
                    padding: 20px;
                    font-family: 'Outfit', sans-serif;
                    z-index: 1000;
                }
                .scrollable-auth {
                    overflow-y: auto;
                    padding: 100px 20px 40px;
                    display: block; /* For scrolling context */
                }
                .scrollable-auth .auth-card-simple {
                    margin: 0 auto;
                }
                .auth-card-simple {
                    background: white;
                    width: 100%;
                    max-width: 450px;
                    padding: 2rem 2rem;
                    border-radius: 24px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e2e8f0;
                }
                .signup-wider {
                    max-width: 480px;
                }
                .auth-card-header {
                    text-align: center;
                    margin-bottom: 1.25rem;
                }
                .auth-icon-circle {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.75rem;
                }
                .auth-card-header h1 {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 0.25rem;
                }
                .auth-card-header p {
                    color: #64748b;
                    font-size: 0.85rem;
                }
                .auth-error-msg {
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
                    gap: 1rem;
                }
                .auth-grid-row {
                    display: flex;
                    gap: 1rem;
                }
                .flex-1 { flex: 1; }
                .auth-input-group label {
                    display: block;
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: #64748b;
                    margin-bottom: 0.3rem;
                    text-transform: uppercase;
                }
                .auth-input-field {
                    position: relative;
                }
                .auth-input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #cbd5e1;
                }
                .auth-input-field input, .auth-plain-input {
                    width: 100%;
                    padding: 0.7rem 1rem 0.7rem 2.8rem;
                    border-radius: 12px;
                    border: 1.5px solid #e2e8f0;
                    background-color: #f8fafc;
                    font-size: 0.9rem;
                    box-sizing: border-box;
                    transition: all 0.2s;
                }
                .auth-plain-input {
                    padding-left: 1rem;
                }
                .auth-main-btn {
                    padding: 0.8rem;
                    border-radius: 12px;
                    color: white;
                    font-weight: 700;
                    font-size: 0.95rem;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 0.5rem;
                }
                .auth-card-footer {
                    text-align: center;
                    margin-top: 1.25rem;
                    font-size: 0.85rem;
                    color: #64748b;
                }
                .auth-card-footer a {
                    text-decoration: none;
                    font-weight: 700;
                    color: #4f46e5;
                }
                @media (max-width: 500px) {
                    .auth-grid-row {
                        flex-direction: column;
                        gap: 1.25rem;
                    }
                    .perfect-center-container { padding: 1rem; position: relative; min-height: 100vh; display: block; overflow-y: auto; }
                    .auth-card-simple { padding: 1.5rem 1.25rem; border-radius: 16px; margin: 1rem auto; max-width: 95%; }
                    .auth-card-header h1 { font-size: 1.15rem; }
                    .auth-grid-row { gap: 0.75rem; }
                }
            `}</style>
        </div>
    );
};

export default Signup;
