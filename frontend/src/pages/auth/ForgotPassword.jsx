import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Brain, ArrowLeft, Mail, KeyRound, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. User might not exist.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/verify-otp', { email, otp });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-fullscreen-center">
            <div className="auth-bg-soft"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-card-v3"
            >
                <div className="auth-header-v3">
                    <div className="auth-icon-v3" style={{ background: '#eef2ff' }}>
                        <Brain size={32} color="#4f46e5" />
                    </div>
                    <h2>Recovery</h2>
                    <p>
                        {step === 1 && "Enter your email to receive an OTP"}
                        {step === 2 && `Code sent to ${email}`}
                        {step === 3 && "Create a new strong password"}
                        {step === 4 && "Password reset complete"}
                    </p>
                </div>

                {error && <div className="auth-error-v3">{error}</div>}

                {/* Step 1: Request OTP */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="auth-form-v3">
                        <div className="auth-field-v3">
                            <label>Email Address</label>
                            <div className="auth-input-v3">
                                <Mail size={18} className="auth-input-ico" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="auth-btn-v3" style={{ backgroundColor: '#4f46e5' }}>
                            {loading ? 'Sending...' : 'Send OTP'}
                            {!loading && <ArrowRight size={18} />}
                        </button>

                        <div className="auth-footer-v3">
                            <Link to="/student/login"><ArrowLeft size={16} /> Back to Login</Link>
                        </div>
                    </form>
                )}

                {/* Step 2: Verify OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="auth-form-v3">
                        <div className="auth-field-v3">
                            <label>6-Digit OTP</label>
                            <div className="auth-input-v3">
                                <KeyRound size={18} className="auth-input-ico" />
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="000000"
                                    style={{ letterSpacing: '4px', textAlign: 'center', paddingLeft: '1rem' }}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading || otp.length !== 6} className="auth-btn-v3" style={{ backgroundColor: '#4f46e5' }}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <div className="auth-footer-v3">
                            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, cursor: 'pointer' }}>
                                Change Email
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="auth-form-v3">
                        <div className="auth-field-v3">
                            <label>New Password</label>
                            <div className="auth-input-v3">
                                <Lock size={18} className="auth-input-ico" />
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    minLength="6"
                                />
                            </div>
                        </div>

                        <div className="auth-field-v3">
                            <label>Confirm Password</label>
                            <div className="auth-input-v3">
                                <Lock size={18} className="auth-input-ico" />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    minLength="6"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="auth-btn-v3" style={{ backgroundColor: '#4f46e5' }}>
                            {loading ? 'Updating...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {/* Step 4: Success Message */}
                {step === 4 && (
                    <div className="auth-success-v3">
                        <div className="auth-success-ico">
                            <CheckCircle2 size={32} color="#10b981" />
                        </div>
                        <p>Your password has been reset. You can now login with your new credentials.</p>
                        <button onClick={() => navigate('/student/login')} className="auth-btn-v3" style={{ backgroundColor: '#4f46e5' }}>
                            Go to Login
                        </button>
                    </div>
                )}
            </motion.div>

            <style>{`
                .auth-fullscreen-center {
                    position: fixed; inset: 0;
                    display: flex; align-items: center; justify-content: center;
                    background-color: #f1f5f9; font-family: 'Outfit', sans-serif;
                    z-index: 9999;
                }
                .auth-bg-soft {
                    position: absolute; inset: 0;
                    background-image: radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%),
                                      radial-gradient(at 100% 100%, rgba(124, 58, 237, 0.05) 0px, transparent 50%);
                }
                .auth-card-v3 {
                    background: white; width: 100%; max-width: 400px;
                    padding: 3rem 2.5rem; border-radius: 24px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e2e8f0; position: relative; z-index: 10;
                }
                .auth-header-v3 { text-align: center; margin-bottom: 2rem; }
                .auth-icon-v3 { width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
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
                .auth-input-v3 input:focus { border-color: #4f46e5; background: white; outline: none; }
                
                .auth-btn-v3 {
                    padding: 1rem; border-radius: 12px; color: white; font-weight: 700;
                    border: none; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 8px; margin-top: 0.5rem; font-size: 1rem; width: 100%;
                }
                .auth-footer-v3 { text-align: center; margin-top: 2rem; color: #64748b; font-size: 0.9rem; }
                .auth-footer-v3 a { text-decoration: none; font-weight: 700; color: #4f46e5; display: inline-flex; align-items: center; gap: 5px; }
                
                .auth-success-v3 { text-align: center; display: flex; flexDirection: column; gap: 1.5rem; align-items: center; }
                .auth-success-ico { width: 64px; height: 64px; border-radius: 50%; background: #d1fae5; display: flex; align-items: center; justify-content: center; }
                
                @media (max-width: 480px) {
                    .auth-fullscreen-center { padding: 1rem; position: relative; min-height: 100vh; display: block; overflow-y: auto; }
                    .auth-card-v3 { padding: 2.5rem 1.5rem; border-radius: 16px; margin: 2rem auto; }
                    .auth-header-v3 h2 { font-size: 1.25rem; }
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
