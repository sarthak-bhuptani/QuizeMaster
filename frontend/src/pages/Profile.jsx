import { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Phone, MapPin, Lock, Camera, Save, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        mobile: '',
        address: '',
        password: '',
        email: '',
        username: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (!storedUser) {
                    navigate('/');
                    return;
                }

                const role = storedUser.studentId ? 'student' : 'teacher';
                const id = storedUser.studentId || storedUser.teacherId;
                
                const res = await api.get(`/${role}/${id}`);
                const data = res.data;
                
                setUserData(data);
                setFormData({
                    first_name: data.user.first_name,
                    last_name: data.user.last_name,
                    mobile: data.mobile,
                    address: data.address || '',
                    email: data.user.email,
                    username: data.user.username,
                    password: '' // Don't pre-fill password
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
                setMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const role = userData.xp !== undefined ? 'student' : 'teacher';
            const id = userData._id;
            
            const payload = { ...formData };
            if (!payload.password) delete payload.password; // Only send password if changed

            await api.put(`/${role}/${id}`, payload);
            
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            
            // Update local storage name if changed
            const storedUser = JSON.parse(localStorage.getItem('user'));
            storedUser.name = formData.first_name;
            localStorage.setItem('user', JSON.stringify(storedUser));
            
            // Refresh local data
            setUserData({ 
                ...userData, 
                user: { ...userData.user, first_name: formData.first_name, last_name: formData.last_name, email: formData.email, username: formData.username },
                mobile: formData.mobile,
                address: formData.address
            });

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-loading-container">
                <Loader2 className="loading-spinner" size={40} />
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-page-wrapper">
            <div className="profile-container">
                {/* Header Section */}
                <div className="profile-header">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1>My Profile</h1>
                    <p>Manage your personal information and account settings.</p>
                </div>

                <div className="profile-content-grid">
                    {/* Sidebar / Overview */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="profile-sidebar"
                    >
                        <div className="profile-card profile-main-card">
                            <div className="profile-avatar-wrapper">
                                <div className="profile-avatar-large">
                                    {formData.first_name.charAt(0).toUpperCase()}
                                </div>
                                <button className="avatar-edit-btn">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2>{formData.first_name} {formData.last_name}</h2>
                            <span className="profile-role-badge">
                                {userData.xp !== undefined ? 'Student' : 'Teacher'}
                            </span>
                            
                            <div className="profile-stats-row">
                                {userData.xp !== undefined ? (
                                    <>
                                        <div className="stat-item">
                                            <span className="stat-value">{userData.xp}</span>
                                            <span className="stat-label">XP Points</span>
                                        </div>
                                        <div className="stat-divider"></div>
                                        <div className="stat-item">
                                            <span className="stat-value">Lvl {userData.level}</span>
                                            <span className="stat-label">Level</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="stat-item">
                                        <span className="stat-value">{userData.status ? 'Active' : 'Pending'}</span>
                                        <span className="stat-label">Account Status</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="profile-card info-card">
                            <h3>Account Security</h3>
                            <p className="card-info-text">Last updated {new Date(userData.updatedAt).toLocaleDateString()}</p>
                            <div className="security-item">
                                <CheckCircle2 size={16} color="#10b981" />
                                <span>Login Verified</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Form Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="profile-main-form"
                    >
                        <form onSubmit={handleSubmit} className="profile-card edit-card">
                            <div className="form-section-header">
                                <h3>Personal Details</h3>
                                <div className="header-line"></div>
                            </div>

                            <AnimatePresence>
                                {message.text && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className={`profile-alert ${message.type}`}
                                    >
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="input-grid">
                                <div className="input-group">
                                    <label>First Name</label>
                                    <div className="input-with-icon">
                                        <User size={18} className="icon" />
                                        <input 
                                            type="text" 
                                            name="first_name" 
                                            value={formData.first_name} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Last Name</label>
                                    <div className="input-with-icon">
                                        <User size={18} className="icon" />
                                        <input 
                                            type="text" 
                                            name="last_name" 
                                            value={formData.last_name} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="input-group full-width">
                                    <label>Email Address</label>
                                    <div className="input-with-icon disabled">
                                        <Mail size={18} className="icon" />
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            disabled 
                                        />
                                    </div>
                                    <span className="helper-text">Email cannot be changed contact support.</span>
                                </div>
                                <div className="input-group">
                                    <label>Username</label>
                                    <div className="input-with-icon disabled">
                                        <User size={18} className="icon" />
                                        <input 
                                            type="text" 
                                            name="username" 
                                            value={formData.username} 
                                            disabled 
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Mobile Number</label>
                                    <div className="input-with-icon">
                                        <Phone size={18} className="icon" />
                                        <input 
                                            type="text" 
                                            name="mobile" 
                                            value={formData.mobile} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="input-group full-width">
                                    <label>Location / Address</label>
                                    <div className="input-with-icon">
                                        <MapPin size={18} className="icon" />
                                        <input 
                                            type="text" 
                                            name="address" 
                                            value={formData.address} 
                                            onChange={handleChange} 
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section-header" style={{ marginTop: '2rem' }}>
                                <h3>Update Password</h3>
                                <div className="header-line"></div>
                            </div>
                            <div className="input-group full-width">
                                <label>New Password (Leave blank to keep current)</label>
                                <div className="input-with-icon">
                                    <Lock size={18} className="icon" />
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="form-footer">
                                <button 
                                    type="submit" 
                                    disabled={saving} 
                                    className="profile-save-btn"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>

            <style>{`
                .profile-page-wrapper {
                    min-height: 100vh;
                    background-color: #f8fafc;
                    padding: 100px 20px 40px;
                    font-family: 'Outfit', sans-serif;
                }
                .profile-container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .profile-header {
                    margin-bottom: 2.5rem;
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: none;
                    border: none;
                    color: #4f46e5;
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 1rem;
                    padding: 0;
                }
                .profile-header h1 {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 0.5rem;
                }
                .profile-header p {
                    color: #64748b;
                    font-size: 1.1rem;
                }
                .profile-content-grid {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 2rem;
                }
                .profile-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .profile-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .profile-main-card {
                    text-align: center;
                }
                .profile-avatar-wrapper {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 1.5rem;
                }
                .profile-avatar-large {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: 800;
                    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
                }
                .avatar-edit-btn {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #e2e8f0;
                    padding: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    color: #4f46e5;
                }
                .profile-main-card h2 {
                    font-size: 1.5rem;
                    color: #0f172a;
                    margin-bottom: 0.5rem;
                }
                .profile-role-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    background-color: #eef2ff;
                    color: #4f46e5;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                }
                .profile-stats-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #f1f5f9;
                }
                .stat-item {
                    display: flex;
                    flex-direction: column;
                }
                .stat-value {
                    font-weight: 800;
                    color: #0f172a;
                    font-size: 1.25rem;
                }
                .stat-label {
                    font-size: 0.75rem;
                    color: #64748b;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .stat-divider {
                    width: 1px;
                    height: 30px;
                    background-color: #e2e8f0;
                }
                .info-card h3 {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }
                .card-info-text {
                    font-size: 0.85rem;
                    color: #94a3b8;
                    margin-bottom: 1.25rem;
                }
                .security-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #334155;
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                .form-section-header {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .form-section-header h3 {
                    font-size: 1.1rem;
                    color: #0f172a;
                    white-space: nowrap;
                }
                .header-line {
                    height: 1px;
                    background-color: #f1f5f9;
                    flex: 1;
                }
                .input-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .full-width { grid-column: span 2; }
                .input-group label {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #475569;
                }
                .input-with-icon {
                    position: relative;
                }
                .icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #cbd5e1;
                }
                .input-with-icon input {
                    width: 100%;
                    padding: 0.85rem 1rem 0.85rem 3rem;
                    border-radius: 12px;
                    border: 2px solid #f1f5f9;
                    background-color: #f8fafc;
                    font-size: 1rem;
                    font-family: inherit;
                    transition: all 0.2s;
                }
                .input-with-icon input:focus {
                    outline: none;
                    border-color: #4f46e5;
                    background-color: white;
                    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
                }
                .input-with-icon.disabled input {
                    background-color: #f1f5f9;
                    color: #94a3b8;
                    cursor: not-allowed;
                }
                .helper-text {
                    font-size: 0.75rem;
                    color: #94a3b8;
                }
                .profile-alert {
                    padding: 1rem;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                    font-weight: 600;
                    font-size: 0.95rem;
                    text-align: center;
                }
                .profile-alert.success { background-color: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
                .profile-alert.error { background-color: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
                .form-footer {
                    margin-top: 2.5rem;
                    display: flex;
                    justify-content: flex-end;
                }
                .profile-save-btn {
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 1.05rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s;
                    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
                }
                .profile-save-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 20px -5px rgba(79, 70, 229, 0.4);
                }
                .profile-save-btn:active:not(:disabled) {
                    transform: translateY(0);
                }
                .profile-save-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @media (max-width: 900px) {
                    .profile-content-grid { grid-template-columns: 1fr; }
                    .profile-sidebar { order: 2; }
                    .profile-main-form { order: 1; }
                }
                @media (max-width: 600px) {
                    .input-grid { grid-template-columns: 1fr; }
                    .full-width { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
