import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, GraduationCap, Shield, User, Edit, Trash2, X, Phone, MapPin, Search, ChevronRight, LayoutDashboard, UserCircle, School, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthPage = location.pathname.includes('login') || location.pathname.includes('signup');
    const isAdmin = location.pathname.includes('admin');

    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [showLoginMenu, setShowLoginMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Edit/Delete States
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        const userData = localStorage.getItem('user');
        const adminData = localStorage.getItem('admin');

        if (userData) {
            const parsed = JSON.parse(userData);
            if (!parsed.role) {
                if (parsed.teacherId) parsed.role = 'Teacher';
                else if (parsed.studentId) parsed.role = 'Student';
            }
            setUser(parsed);
        } else if (adminData) {
            setUser({ ...JSON.parse(adminData), role: 'Admin' });
        } else {
            setUser(null);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    // Close menus on click outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowProfile(false);
            setShowLoginMenu(false);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        setUser(null);
        setShowProfile(false);
        navigate('/');
    };

    const getUserId = () => user?.studentId || user?.teacherId || user?._id;

    const handleEditClick = async (e) => {
        e.stopPropagation();
        setLoading(true);
        try {
            let role = 'student';
            if (user?.teacherId) role = 'teacher';
            else if (user?.role === 'Admin') role = 'admin';

            const endpoint = `http://127.0.0.1:5001/api/${role}/${getUserId()}`;
            const res = await axios.get(endpoint);

            const d = res.data;
            setEditData({
                first_name: d.user?.first_name || '',
                last_name: d.user?.last_name || '',
                username: d.user?.username || '',
                mobile: d.mobile || '',
                address: d.address || ''
            });
            setShowProfile(false);
            setShowEditModal(true);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch details.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let role = 'student';
            if (user?.teacherId) role = 'teacher';
            else if (user?.role === 'Admin') role = 'admin';

            const endpoint = `http://127.0.0.1:5001/api/${role}/${getUserId()}`;
            const res = await axios.put(endpoint, editData);

            const updatedName = editData.first_name;
            const stored = JSON.parse(localStorage.getItem('user'));
            if (stored) {
                stored.name = updatedName;
                localStorage.setItem('user', JSON.stringify(stored));
                setUser(stored);
            }

            alert(res.data.message);
            setShowEditModal(false);
        } catch (err) {
            console.error(err);
            alert("Update failed: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

        try {
            const role = user.role?.toLowerCase() || 'student';
            const endpoint = `http://127.0.0.1:5001/api/${role}/${getUserId()}`;
            await axios.delete(endpoint);
            alert("Account Deleted.");
            handleLogout();
        } catch (err) {
            alert("Delete failed.");
        }
    };

    const navLinks = [
        { name: 'Overview', path: '/' },
        { name: 'Dashboard', path: user ? (user.role === 'Admin' ? '/admin-dashboard' : user.role === 'Teacher' ? '/teacher-dashboard' : '/student-dashboard') : null }
    ].filter(link => link.path);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0,
                    width: '100%', zIndex: 1000,
                    height: scrolled ? '70px' : '85px',
                    background: scrolled ? 'rgba(5, 5, 5, 0.85)' : 'rgba(5, 5, 5, 0.4)',
                    backdropFilter: 'blur(20px) saturate(160%)',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.3)' : 'none'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    width: 'min(92%, 1400px)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* Brand Section */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            background: isAdmin ? 'linear-gradient(135deg, var(--danger), #991b1b)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: isAdmin ? '0 0 20px rgba(239, 68, 68, 0.3)' : '0 0 20px var(--primary-glow)'
                        }}>
                            <GraduationCap size={22} color="white" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                fontSize: '1.25rem', fontWeight: '900', color: 'white', letterSpacing: '-0.02em', lineHeight: 1
                            }}>
                                Quiz<span style={{ color: isAdmin ? 'var(--danger)' : 'var(--primary)' }}>Master</span>
                            </span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>
                                {isAdmin ? 'Admin Console' : 'Intellect Platform'}
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div style={{ display: 'none', gap: '2.5rem', alignItems: 'center' }} className="nav-desktop-links">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.includes('dashboard'));
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    style={{
                                        textDecoration: 'none',
                                        color: isActive ? 'white' : 'var(--text-secondary)',
                                        fontSize: '0.85rem', fontWeight: '700',
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        transition: '0.3s ease',
                                        position: 'relative'
                                    }}
                                    className="nav-link-item"
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-dot"
                                            style={{ width: '4px', height: '4px', background: isAdmin ? 'var(--danger)' : 'var(--primary)', borderRadius: '50%' }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Action Section */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {user ? (
                            <div style={{ position: 'relative' }}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    onClick={(e) => { e.stopPropagation(); setShowProfile(!showProfile); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
                                        padding: '0.4rem 0.4rem 0.4rem 1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--glass-border)'
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} className="nav-user-meta">
                                        <span style={{ color: 'white', fontWeight: '800', fontSize: '0.8rem' }}>{user.name || user.username}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.6rem', textTransform: 'uppercase' }}>{user.role}</span>
                                    </div>
                                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white' }}>
                                        {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {showProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 15, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            style={{
                                                position: 'absolute', top: '100%', right: 0, width: '280px',
                                                background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '20px',
                                                padding: '1rem', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', zIndex: 1100
                                            }}
                                        >
                                            <div style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900' }}>
                                                    {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ color: 'white', fontWeight: '900' }}>{user.name || user.username}</div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{user.role} Account</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gap: '0.25rem' }}>
                                                {user.role !== 'Admin' && (
                                                    <button onClick={handleEditClick} className="nav-dropdown-btn">
                                                        <Edit size={16} /> Edit Profile
                                                    </button>
                                                )}
                                                <button onClick={handleLogout} className="nav-dropdown-btn" style={{ color: 'var(--danger)' }}>
                                                    <LogOut size={16} /> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            !isAuthPage && (
                                <div style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div
                                            onClick={(e) => { e.stopPropagation(); setShowLoginMenu(!showLoginMenu); }}
                                            style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                        >
                                            Sign In <ChevronRight size={14} style={{ transform: showLoginMenu ? 'rotate(90deg)' : 'none', transition: '0.3s' }} />
                                        </div>

                                        <Link to="/student/signup" style={{ textDecoration: 'none' }}>
                                            <motion.button
                                                whileHover={{ scale: 1.02, background: 'white', color: 'black' }}
                                                className="btn btn-primary"
                                                style={{
                                                    padding: '0.7rem 1.8rem', fontSize: '0.85rem'
                                                }}
                                            >
                                                Get Started
                                            </motion.button>
                                        </Link>
                                    </div>

                                    <AnimatePresence>
                                        {showLoginMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 15, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                style={{
                                                    position: 'absolute', top: '100%', right: 0, width: '240px',
                                                    background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '20px',
                                                    padding: '0.8rem', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', zIndex: 1100
                                                }}
                                            >
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.5rem 0.8rem' }}>Select Role</div>
                                                <Link to="/student/login" className="nav-dropdown-btn">
                                                    <UserCircle size={18} /> Student Login
                                                </Link>
                                                <Link to="/teacher/login" className="nav-dropdown-btn">
                                                    <School size={18} /> Teacher Login
                                                </Link>
                                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.4rem 0.5rem' }}></div>
                                                <Link to="/admin/login" className="nav-dropdown-btn" style={{ color: 'var(--danger)' }}>
                                                    <ShieldCheck size={18} /> Administrator
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <style>{`
                    .nav-link-item:hover { color: white !important; }
                    .nav-dropdown-btn {
                        width: 100%; padding: 0.8rem 1rem; display: flex; alignItems: center; gap: 1rem;
                        background: transparent; border: none; color: var(--text-secondary); border-radius: 12px;
                        cursor: pointer; transition: 0.2s; text-align: left; font-size: 0.85rem; font-weight: 700;
                        text-decoration: none;
                    }
                    .nav-dropdown-btn:hover { background: rgba(255,255,255,0.05); color: white; }
                    
                    @media (min-width: 992px) {
                        .nav-desktop-links { display: flex !important; }
                    }
                    @media (max-width: 640px) {
                        .nav-user-meta { display: none !important; }
                    }
                `}</style>
            </motion.nav>

            {/* Edit Profile Modal (Full width consistent design) */}
            <AnimatePresence>
                {showEditModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card"
                            style={{
                                width: 'min(92%, 600px)', borderRadius: '24px',
                                border: '1px solid var(--glass-border)', padding: '2.5rem', boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white' }}>Profile Settings</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Refine your account details</p>
                                </div>
                                <button onClick={() => setShowEditModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>First Name</label>
                                        <input value={editData.first_name || ''} onChange={e => setEditData({ ...editData, first_name: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Last Name</label>
                                        <input value={editData.last_name || ''} onChange={e => setEditData({ ...editData, last_name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Username</label>
                                    <input value={editData.username || ''} onChange={e => setEditData({ ...editData, username: e.target.value })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Phone</label>
                                        <input value={editData.mobile || ''} onChange={e => setEditData({ ...editData, mobile: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Location</label>
                                        <input value={editData.address || ''} onChange={e => setEditData({ ...editData, address: e.target.value })} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                        {loading ? 'Saving...' : 'Update Details'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
