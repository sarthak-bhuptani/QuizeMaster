import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
    LogOut, LayoutDashboard, UserCircle, School, ShieldCheck, 
    Menu, X, ChevronDown, BookOpen, Trophy, Activity, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
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
        const userData = sessionStorage.getItem('user');
        const adminData = sessionStorage.getItem('admin');

        if (userData) {
            const parsed = JSON.parse(userData);
            if (!parsed.role) {
                if (parsed.teacherId) parsed.role = 'Teacher';
                else if (parsed.studentId) parsed.role = 'Student';
            }
            setUser(parsed);

            // Fetch profile pic
            const role = parsed.teacherId ? 'teacher' : 'student';
            const id = parsed.teacherId || parsed.studentId;
            if (id) {
                fetch(`http://localhost:5001/api/${role}/${id}`)
                    .then(r => r.json())
                    .then(data => {
                        if (data?.profile_pic) setProfilePic(data.profile_pic);
                        else setProfilePic(null);
                    })
                    .catch(() => setProfilePic(null));
            }
        } else if (adminData) {
            setUser({ ...JSON.parse(adminData), role: 'Admin' });
        } else {
            setUser(null);
        }
    }, [location.pathname]);

    // Listen for profile pic updates from Profile page
    useEffect(() => {
        const handler = (e) => {
            if (e.detail?.profile_pic) setProfilePic(e.detail.profile_pic);
        };
        window.addEventListener('profilePicUpdated', handler);
        return () => window.removeEventListener('profilePicUpdated', handler);
    }, []);

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
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('admin');
        setUser(null);
        navigate('/');
    };

    const dashboardPath = user ? (
        user.role === 'Admin' ? '/admin-dashboard' : 
        user.role === 'Teacher' ? '/teacher-dashboard' : 
        '/student-dashboard'
    ) : null;

    const isDashboard = location.pathname.includes('dashboard');

    const dashboardLinks = {
        Student: [
            { label: 'My Overview', id: 'overview', icon: LayoutDashboard },
            { label: 'Available Exams', id: 'exams', icon: BookOpen },
            { label: 'Result History', id: 'history', icon: Activity },
            { label: 'Hall of Fame', id: 'leaderboard', icon: Trophy },
        ],
        Teacher: [
            { label: 'Dashboard', id: 'overview', icon: LayoutDashboard },
            { label: 'My Quizzes', id: 'quizzes', icon: BookOpen },
            { label: 'Students', id: 'students', icon: UserCircle },
            { label: 'Results', id: 'results', icon: Trophy },
        ],
        Admin: [
            { label: 'Overview', id: 'overview', icon: LayoutDashboard },
            { label: 'Students', id: 'students', icon: UserCircle },
            { label: 'Teachers', id: 'teachers', icon: School },
            { label: 'Quizzes', id: 'courses', icon: BookOpen },
        ]
    };

    const currentDashboardLinks = user && dashboardLinks[user.role] ? dashboardLinks[user.role] : [];

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
                                <button className="user-pill hide-on-mobile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                    <div className="pill-avatar">
                                        {profilePic
                                            ? <img src={profilePic} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                            : (user.name || user.username || 'U').charAt(0).toUpperCase()
                                        }
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
                                            <div className="dropdown-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {profilePic && (
                                                    <img src={profilePic} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span className="user-name">{user.name || user.username}</span>
                                                    <span className="user-role">{user.role} Portal</span>
                                                </div>
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
                                    <button className="btn-login-ghost hide-on-mobile" onClick={() => setShowLoginMenu(!showLoginMenu)}>
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <Link to="/student/signup" className="btn-get-started hide-on-mobile">Start Learning</Link>
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
                        .hide-on-mobile { display: none !important; }
                    }
                `}</style>
            </nav>

            {/* Mobile Sidebar - Enhanced for Dashboard */}
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
                                <div className="drawer-brand">
                                    <div className="drawer-logo-wrapper">
                                        <img src="/logo.png" alt="QuizMaster" />
                                    </div>
                                    <div className="brand-info-text">
                                        <span className="portal-name">{user ? `${user.role} Portal` : 'QuizMaster'}</span>
                                        <span className="app-label">Master your skills</span>
                                    </div>
                                </div>
                                <button className="drawer-close-btn" onClick={() => setMobileMenuOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="drawer-nav">
                                {user && (
                                    <div className="mobile-user-card">
                                        <div className="user-card-head">
                                            <div className="pill-avatar large">
                                                {profilePic
                                                    ? <img src={profilePic} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                    : (user.name || user.username || 'U').charAt(0).toUpperCase()
                                                }
                                            </div>
                                            <div className="user-card-info">
                                                <div className="user-card-name">{user.name || user.username}</div>
                                                <div className="user-card-role">{user.role} Account</div>
                                            </div>
                                        </div>
                                        <div className="user-card-stats">
                                            <div className="stat-item">
                                                <span className="stat-value">Active</span>
                                                <span className="stat-label">Status</span>
                                            </div>
                                            <div className="stat-divider"></div>
                                            <div className="stat-item">
                                                <span className="stat-value">v1.2</span>
                                                <span className="stat-label">Version</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="drawer-section-label">Main Navigation</div>
                                <Link to="/" className={`drawer-item ${location.pathname === '/' ? 'active' : ''}`}>
                                    <Target size={20} /> <span className="item-label">Home</span>
                                </Link>

                                {isDashboard && currentDashboardLinks.length > 0 && (
                                    <>
                                        <div className="drawer-section-label">{user?.role} Menu</div>
                                        {currentDashboardLinks.map((link) => (
                                            <button 
                                                key={link.id}
                                                onClick={() => {
                                                    navigate(`${dashboardPath}?tab=${link.id}`);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={`drawer-item ${new URLSearchParams(location.search).get('tab') === link.id || (link.id === 'overview' && !new URLSearchParams(location.search).get('tab')) ? 'active' : ''}`}
                                            >
                                                <link.icon size={20} />
                                                <span className="item-label">{link.label}</span>
                                            </button>
                                        ))}
                                    </>
                                )}

                                {!isDashboard && dashboardPath && (
                                    <Link to={dashboardPath} className="drawer-item">
                                        <LayoutDashboard size={20} /> <span className="item-label">My Dashboard</span>
                                    </Link>
                                )}
                                
                                <div className="drawer-section-label">Account Settings</div>
                                {user ? (
                                    <>
                                        <button onClick={() => navigate('/profile')} className="drawer-item">
                                            <UserCircle size={20} /> <span className="item-label">My Profile</span>
                                        </button>
                                        <button onClick={handleLogout} className="drawer-item danger">
                                            <LogOut size={20} /> <span className="item-label">Sign Out Session</span>
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
                                        <div style={{ padding: '0 1rem', marginTop: '1rem' }}>
                                            <Link to="/student/signup" className="btn-get-started" style={{ textAlign: 'center', display: 'block', width: '100%' }}>
                                                Start Learning Free
                                            </Link>
                                        </div>
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
