import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, GraduationCap, Shield, User, Edit, Trash2, X, Phone, MapPin, Search, ChevronRight, LayoutDashboard, UserCircle, School, ShieldCheck, Menu, Brain } from 'lucide-react';
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Edit/Delete States
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
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

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        setUser(null);
        setShowProfile(false);
        navigate('/');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        // Placeholder for update logic
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowEditModal(false);
        }, 1000);
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
                className={`main-nav ${scrolled ? 'scrolled' : ''}`}
            >
                <div className="nav-container">
                    {/* Brand Section */}
                    <Link to="/" className="nav-brand">
                        <div className="brand-icon-wrapper">
                            <Brain size={22} className="brand-icon" />
                        </div>
                        <div className="brand-text-wrapper">
                            <span className="brand-name">
                                Quize<span className="brand-accent">Master</span>
                            </span>
                            <span className="brand-tagline">
                                {isAdmin ? 'Admin Console' : 'Intellect Platform'}
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links - Desktop Only */}
                    <div className="nav-links-desktop">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.includes('dashboard'));
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav-indicator"
                                            className="nav-active-indicator"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Action Section */}
                    <div className="nav-actions">
                        {user ? (
                            <div className="user-profile-wrapper">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => { e.stopPropagation(); setShowProfile(!showProfile); }}
                                    className="profile-trigger"
                                >
                                    <div className="user-meta desktop-only">
                                        <span className="user-name">{user.name || user.username}</span>
                                        <span className="user-role">{user.role}</span>
                                    </div>
                                    <div className="user-avatar-small">
                                        {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {showProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 15, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="nav-dropdown profile-dropdown"
                                        >
                                            <div className="dropdown-header">
                                                <div className="user-avatar-large">
                                                    {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="header-name">{user.name || user.username}</div>
                                                    <div className="header-role">{user.role} Account</div>
                                                </div>
                                            </div>
                                            <div className="dropdown-items">
                                                {user.role !== 'Admin' && (
                                                    <button onClick={() => navigate('/student-dashboard')} className="dropdown-item">
                                                        <LayoutDashboard size={16} /> Dashboard
                                                    </button>
                                                )}
                                                <button onClick={handleLogout} className="dropdown-item logout-btn">
                                                    <LogOut size={16} /> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            !isAuthPage && (
                                <div className="auth-actions desktop-only">
                                    <div className="login-menu-wrapper">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowLoginMenu(!showLoginMenu); }}
                                            className="login-trigger-btn"
                                        >
                                            Portal <ChevronRight size={14} className={`chevron ${showLoginMenu ? 'rotate' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {showLoginMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 15, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="nav-dropdown login-dropdown"
                                                >
                                                    <div className="dropdown-label">Select Role</div>
                                                    <Link to="/student/login" className="dropdown-item">
                                                        <UserCircle size={18} /> Student Access
                                                    </Link>
                                                    <Link to="/teacher/login" className="dropdown-item">
                                                        <School size={18} /> Teacher Portal
                                                    </Link>
                                                    <div className="dropdown-divider"></div>
                                                    <Link to="/admin/login" className="dropdown-item admin-link">
                                                        <ShieldCheck size={18} /> Administrator
                                                    </Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <Link to="/student/signup" className="signup-link">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="get-started-btn"
                                        >
                                            Get Started
                                        </motion.button>
                                    </Link>
                                </div>
                            )
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Navigation Mesh Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mobile-nav-overlay"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="mobile-nav-menu"
                    >
                        <div className="mobile-menu-header">
                            <span className="brand-name">
                                Quize<span className="brand-accent">Master</span>
                            </span>
                            <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                                <X size={28} />
                            </button>
                        </div>

                        <div className="mobile-links-container">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.path} className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    {link.name} <ChevronRight size={16} />
                                </Link>
                            ))}

                            {!user && (
                                <div className="mobile-auth-section">
                                    <div className="mobile-section-label">Access Portal</div>
                                    <Link to="/student/login" className="mobile-portal-item" onClick={() => setMobileMenuOpen(false)}>
                                        <UserCircle size={20} /> Student Login
                                    </Link>
                                    <Link to="/teacher/login" className="mobile-portal-item" onClick={() => setMobileMenuOpen(false)}>
                                        <School size={20} /> Teacher Login
                                    </Link>
                                    <Link to="/admin/login" className="mobile-portal-item danger" onClick={() => setMobileMenuOpen(false)}>
                                        <ShieldCheck size={20} /> Admin login
                                    </Link>

                                    <Link to="/student/signup" className="mobile-signup-btn" onClick={() => setMobileMenuOpen(false)}>
                                        Create Account
                                    </Link>
                                </div>
                            )}

                            {user && (
                                <div className="mobile-auth-section">
                                    <div className="mobile-section-label">User Account</div>
                                    <div className="mobile-user-info">
                                        <div className="user-avatar-small">
                                            {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ color: 'white', fontWeight: '800' }}>{user.name || user.username}</div>
                                            <div style={{ color: 'var(--primary)', fontSize: '0.7rem' }}>{user.role} Member</div>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="mobile-portal-item danger" style={{ marginTop: '1rem' }}>
                                        <LogOut size={20} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showEditModal && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="modal-container"
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />

                            <div className="modal-header">
                                <div>
                                    <h2 className="modal-title">Account Settings</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Manage your profile information</p>
                                </div>
                                <button className="modal-close" onClick={() => setShowEditModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="modal-form" onSubmit={handleUpdate}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">First Name</label>
                                        <input
                                            className="form-input"
                                            value={editData.first_name || ''}
                                            onChange={e => setEditData({ ...editData, first_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            className="form-input"
                                            value={editData.last_name || ''}
                                            onChange={e => setEditData({ ...editData, last_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Username</label>
                                    <input
                                        className="form-input"
                                        value={editData.username || ''}
                                        onChange={e => setEditData({ ...editData, username: e.target.value })}
                                    />
                                </div>
                                <button className="modal-submit" type="submit">
                                    {loading ? 'Processing...' : 'Save Synchronization'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .main-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: 90px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    background: rgba(5, 5, 5, 0.1);
                    backdrop-filter: blur(0px);
                    border-bottom: 1px solid transparent;
                }

                .main-nav.scrolled {
                    height: 75px;
                    background: rgba(5, 5, 5, 0.85);
                    backdrop-filter: blur(30px) saturate(180%);
                    border-bottom: 1px solid rgba(6, 182, 212, 0.15);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                }

                .nav-container {
                    width: 100%;
                    max-width: 1536px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 2rem;
                }

                .nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    text-decoration: none;
                    transition: transform 0.3s ease;
                }

                .brand-icon-wrapper {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .brand-icon {
                    color: white;
                }

                .brand-name {
                    font-family: 'Outfit', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 900;
                    color: white;
                    letter-spacing: -1px;
                    line-height: 1;
                }

                .brand-accent {
                    color: var(--primary);
                }

                .brand-tagline {
                    font-size: 0.6rem;
                    color: var(--text-secondary);
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    margin-top: 6px;
                    display: block;
                    opacity: 0.7;
                }

                .nav-links-desktop {
                    display: none;
                    gap: 3rem;
                    align-items: center;
                }

                @media (min-width: 1024px) {
                    .nav-links-desktop { display: flex; }
                }

                .nav-link {
                    text-decoration: none;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    font-weight: 700;
                    transition: all 0.3s ease;
                    position: relative;
                    padding: 0.5rem 0;
                    letter-spacing: 0.5px;
                }

                .nav-link.active {
                    color: var(--primary);
                }

                .nav-active-indicator {
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: var(--primary);
                    border-radius: 10px;
                }

                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }

                .profile-trigger {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 6px 6px 6px 16px;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.4s ease;
                }

                .user-name {
                    color: var(--text-primary);
                    font-weight: 700;
                    font-size: 0.9rem;
                }

                .user-role {
                    color: var(--primary);
                    font-size: 0.65rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .user-avatar-small {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 800;
                }

                .nav-dropdown {
                    position: absolute;
                    top: calc(100% + 15px);
                    right: 0;
                    background: rgba(10, 10, 10, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(20px);
                    z-index: 2100;
                    overflow: hidden;
                }

                .profile-dropdown { width: 300px; }
                .login-dropdown { width: 260px; padding: 0.75rem; }

                .dropdown-header {
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .user-avatar-large {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 900;
                    font-size: 1.4rem;
                }

                .header-name { color: white; font-weight: 800; font-size: 1.1rem; }
                .header-role { color: var(--primary); font-size: 0.75rem; font-weight: 600; }

                .dropdown-item {
                    padding: 1rem 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--text-secondary);
                    transition: all 0.2s ease;
                    font-weight: 600;
                    font-size: 0.9rem;
                    text-decoration: none;
                    background: transparent;
                    border: none;
                    width: 100%;
                    cursor: pointer;
                    text-align: left;
                }

                .logout-btn { color: var(--danger) !important; }

                .login-trigger-btn {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: var(--text-primary);
                    font-weight: 600;
                    padding: 0.6rem 1.2rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }

                .get-started-btn {
                    background: white;
                    color: black;
                    border: none;
                    padding: 0.75rem 1.75rem;
                    border-radius: 12px;
                    font-weight: 800;
                    font-size: 0.9rem;
                    cursor: pointer;
                }

                .mobile-menu-toggle {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                }

                @media (min-width: 1024px) {
                    .mobile-menu-toggle { display: none; }
                }

                .mobile-nav-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    z-index: 2500;
                }

                .mobile-nav-menu {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 100%;
                    max-width: 400px;
                    height: 100vh;
                    background: #050505;
                    z-index: 3000;
                    padding: 2rem 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    box-shadow: -10px 0 50px rgba(0, 0, 0, 0.5);
                    overflow-y: auto;
                }

                .mobile-menu-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    margin-bottom: 1rem;
                }

                .mobile-close-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: none;
                    color: white;
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .mobile-nav-link {
                    color: white;
                    text-decoration: none;
                    font-size: 1.5rem;
                    font-weight: 800;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .mobile-auth-section { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
                .mobile-section-label { font-size: 0.7rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 2px; }
                
                .mobile-portal-item {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 1.25rem;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: white;
                    text-decoration: none;
                    font-weight: 700;
                }

                .mobile-signup-btn {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    text-align: center;
                    padding: 1.25rem;
                    border-radius: 15px;
                    text-decoration: none;
                    font-weight: 900;
                    margin-top: 1rem;
                }

                .desktop-only { display: none; }
                @media (min-width: 768px) { .desktop-only { display: flex; } }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 4000;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(15px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-container {
                    width: min(92%, 550px);
                    background: #0a0a0a;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 2.5rem;
                    position: relative;
                }

                .modal-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
                .modal-title { font-size: 1.8rem; font-weight: 900; color: white; }
                .modal-close { background: rgba(255, 255, 255, 0.05); border: none; color: white; width: 40px; height: 40px; border-radius: 10px; }

                .modal-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-label { font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; }
                .form-input { 
                    background: rgba(255, 255, 255, 0.03); 
                    border: 1px solid rgba(255, 255, 255, 0.1); 
                    padding: 1rem; 
                    border-radius: 12px; 
                    color: white; 
                }
                .modal-submit {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    border: none;
                    padding: 1.25rem;
                    border-radius: 15px;
                    font-weight: 900;
                }
            `}</style>
        </>
    );
};

export default Navbar;
