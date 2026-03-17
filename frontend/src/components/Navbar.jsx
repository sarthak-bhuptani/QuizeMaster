import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { LogOut, LayoutDashboard, UserCircle, School, ShieldCheck, Menu, X, Brain, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLoginMenu, setShowLoginMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const loginMenuRef = useRef(null);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
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
    }, [location.pathname]);

    useEffect(() => {
        setMobileMenuOpen(false);
        setShowProfileMenu(false);
        setShowLoginMenu(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (loginMenuRef.current && !loginMenuRef.current.contains(event.target)) setShowLoginMenu(false);
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setShowProfileMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        setUser(null);
        navigate('/');
    };

    const dashboardPath = user ? (user.role === 'Admin' ? '/admin-dashboard' : user.role === 'Teacher' ? '/teacher-dashboard' : '/student-dashboard') : null;

    return (
        <>
            <nav className={`navbar-premium ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container-inner">
                    <Link to="/" className="brand-section">
                        <img src="/logo.png" alt="QuizMaster" className="brand-logo" />
                        <span className="brand-title">QuizMaster</span>
                    </Link>

                    {/* Desktop Menu - Center Aligned */}
                    <div className="nav-links-centered">
                        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                        {dashboardPath && (
                            <Link to={dashboardPath} className={`nav-item ${location.pathname.includes('dashboard') ? 'active' : ''}`}>Dashboard</Link>
                        )}
                    </div>

                    <div className="nav-actions">
                        {user ? (
                            <div className="nav-profile-wrapper" ref={profileMenuRef} style={{ position: 'relative' }}>
                                <button className="user-pill" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                    <div className="pill-avatar">
                                        {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <span className="pill-info">{user.name || user.username}</span>
                                    <ChevronDown size={14} />
                                </button>

                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="dropdown-glass"
                                        >
                                            <div className="dropdown-header">
                                                <span className="user-name">{user.name || user.username}</span>
                                                <span className="user-role">{user.role} Portal</span>
                                            </div>
                                            <button onClick={() => navigate('/profile')} className="dropdown-link">
                                                <UserCircle size={18} /> Profile Setting
                                            </button>
                                            <button onClick={() => navigate(dashboardPath)} className="dropdown-link">
                                                <LayoutDashboard size={18} /> Dashboard
                                            </button>
                                            <button onClick={handleLogout} className="dropdown-link danger">
                                                <LogOut size={18} /> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <div className="login-context" ref={loginMenuRef} style={{ position: 'relative' }}>
                                    <button className="btn-login-ghost" onClick={() => setShowLoginMenu(!showLoginMenu)}>
                                        Login <ChevronDown size={14} />
                                    </button>
                                    <AnimatePresence>
                                        {showLoginMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="dropdown-glass"
                                            >
                                                <Link to="/student/login" className="dropdown-link">
                                                    <UserCircle size={18} /> Student Access
                                                </Link>
                                                <Link to="/teacher/login" className="dropdown-link">
                                                    <School size={18} /> Teacher Access
                                                </Link>
                                                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '4px 0' }}></div>
                                                <Link to="/admin/login" className="dropdown-link">
                                                    <ShieldCheck size={18} /> Administrative
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <Link to="/student/signup" className="btn-get-started">Start Learning</Link>
                            </>
                        )}

                        <button className="btn-mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                    </div>
                </div>

                <style>{`
                    @media (max-width: 1024px) {
                        .btn-mobile-toggle { display: block !important; }
                    }
                `}</style>
            </nav>

            {/* Mobile Sidebar - Rendered outside the fixed navbar to avoid transform issues */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="drawer-overlay"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="mobile-drawer"
                        >
                            <div className="drawer-header">
                                <span className="brand-title" style={{ display: 'block' }}>Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={24} color="#0f172a" />
                                </button>
                            </div>
                            
                            <div className="drawer-nav">
                                <Link to="/" className={`drawer-item ${location.pathname === '/' ? 'active' : ''}`}>
                                    Home
                                </Link>
                                {dashboardPath && (
                                    <Link to={dashboardPath} className={`drawer-item ${location.pathname.includes('dashboard') ? 'active' : ''}`}>
                                        Dashboard
                                    </Link>
                                )}
                                
                                <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.5rem 0' }}></div>
                                
                                {user ? (
                                    <>
                                        <button onClick={() => navigate('/profile')} className="drawer-item">
                                            <UserCircle size={20} /> My Profile
                                        </button>
                                        <button onClick={handleLogout} className="drawer-item danger" style={{ color: '#ef4444' }}>
                                            <LogOut size={20} /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/student/login" className="drawer-item">
                                            <UserCircle size={20} /> Student Login
                                        </Link>
                                        <Link to="/teacher/login" className="drawer-item">
                                            <School size={20} /> Teacher Login
                                        </Link>
                                        <Link to="/student/signup" className="btn-get-started" style={{ textAlign: 'center', marginTop: '1.5rem', display: 'block' }}>
                                            Start Learning Free
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
