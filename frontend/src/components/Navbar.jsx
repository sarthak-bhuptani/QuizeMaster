import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { LogOut, LayoutDashboard, UserCircle, School, ShieldCheck, Menu, X, Brain, ChevronDown, Trophy, Activity, BookOpen, Users, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Minimal states for navbar
    const [user, setUser] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLoginMenu, setShowLoginMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const activeTabParam = searchParams.get('tab') || 'overview';

    const loginMenuRef = useRef(null);
    const profileMenuRef = useRef(null);

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
            if (loginMenuRef.current && !loginMenuRef.current.contains(event.target)) {
                setShowLoginMenu(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
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

    const navLinks = [
        { name: 'Home', path: '/', icon: School },
        { name: 'Dashboard', path: user ? (user.role === 'Admin' ? '/admin-dashboard' : user.role === 'Teacher' ? '/teacher-dashboard' : '/student-dashboard') : null, icon: LayoutDashboard }
    ].filter(link => link.path);

    return (
        <nav style={navStyle}>
            <div style={navContainerStyle}>
                <Link to="/" style={brandLinkStyle}>
                    <img src="/logo.png" alt="QuizMaster Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                    <span style={brandNameStyle}>QuizMaster</span>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu-wrapper" style={desktopMenuWrapper}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                style={{
                                    ...navLinkStyle,
                                    color: location.pathname === link.path ? '#4f46e5' : '#475569',
                                    fontWeight: location.pathname === link.path ? '600' : '500'
                                }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '2rem' }}>
                        {user ? (
                            <div style={{ position: 'relative' }} ref={profileMenuRef}>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    style={profileButtonStyle}
                                >
                                    <div style={avatarStyle}>
                                        {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ fontWeight: '500', color: '#1f2937' }}>{user.name || user.username}</span>
                                    <ChevronDown size={14} color="#64748b" />
                                </button>

                                {showProfileMenu && (
                                    <div style={dropdownStyle}>
                                        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                                            <div style={{ fontWeight: '600', color: '#0f172a' }}>{user.name || user.username}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user.role}</div>
                                        </div>
                                        {user.role !== 'Admin' && (
                                            <>
                                                <button onClick={() => navigate('/profile')} style={dropdownItemStyle}>
                                                    <UserCircle size={16} /> My Profile
                                                </button>
                                                <button 
                                                    onClick={() => navigate(user.role === 'Teacher' ? '/teacher-dashboard' : '/student-dashboard')} 
                                                    style={dropdownItemStyle}
                                                >
                                                    <LayoutDashboard size={16} /> Dashboard
                                                </button>
                                            </>
                                        )}
                                        <button onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ef4444' }}>
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div style={{ position: 'relative' }} ref={loginMenuRef}>
                                    <button
                                        onClick={() => setShowLoginMenu(!showLoginMenu)}
                                        className="nav-link-btn"
                                        style={navLinkButtonStyle}
                                    >
                                        Login <ChevronDown size={14} />
                                    </button>

                                    {showLoginMenu && (
                                        <div style={dropdownStyle}>
                                            <Link to="/student/login" style={dropdownItemStyle}>
                                                <UserCircle size={16} /> Student Login
                                            </Link>
                                            <Link to="/teacher/login" style={dropdownItemStyle}>
                                                <School size={16} /> Teacher Login
                                            </Link>
                                            <div style={{ borderTop: '1px solid #e2e8f0', margin: '4px 0' }}></div>
                                            <Link to="/admin/login" style={{ ...dropdownItemStyle, color: '#475569' }}>
                                                <ShieldCheck size={16} /> Admin Login
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <Link to="/student/signup">
                                    <button style={primaryButtonStyle}>Get Started</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle"
                    style={mobileToggleStyle}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Content */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="mobile-nav-menu"
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                width: '100%',
                                maxWidth: '340px',
                                height: '100vh',
                                backgroundColor: '#ffffff',
                                zIndex: 3000,
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '-10px 0 25px rgba(0,0,0,0.1)'
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ ...brandIconStyle, width: '32px', height: '32px' }}>
                                        <Brain size={18} color="#ffffff" />
                                    </div>
                                    <span style={{ ...brandNameStyle, fontSize: '1.4rem' }}>QuizMaster</span>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ background: '#f8fafc', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', color: '#64748b' }}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Dashboard Sub-links for Mobile */}
                            {user && location.pathname.toLowerCase().includes('dashboard') && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem', paddingLeft: '1rem' }}>
                                        {user.role} Navigation
                                    </div>
                                    {(user.role === 'Student' ? [
                                        { name: 'My Overview', tab: 'overview', icon: LayoutDashboard },
                                        { name: 'Available Exams', tab: 'exams', icon: BookOpen },
                                        { name: 'Result History', tab: 'history', icon: Activity },
                                        { name: 'Hall of Fame', tab: 'leaderboard', icon: Trophy },
                                    ] : user.role === 'Teacher' ? [
                                        { name: 'Overview', tab: 'overview', icon: LayoutDashboard },
                                        { name: 'My Quizzes', tab: 'courses', icon: BookOpen },
                                        { name: 'Students', tab: 'students', icon: Users },
                                        { name: 'Results', tab: 'results', icon: Activity },
                                    ] : [
                                        { name: 'Overview', tab: 'overview', icon: LayoutDashboard },
                                        { name: 'Students', tab: 'students', icon: Users },
                                        { name: 'Teachers', tab: 'teachers', icon: GraduationCap },
                                        { name: 'Quizzes', tab: 'courses', icon: BookOpen },
                                    ]).map((item) => (
                                        <Link
                                            key={item.tab}
                                            to={`${location.pathname}?tab=${item.tab}`}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                borderRadius: '12px',
                                                textDecoration: 'none',
                                                color: activeTabParam === item.tab ? '#4f46e5' : '#475569',
                                                fontWeight: '600',
                                                fontSize: '0.9rem',
                                                backgroundColor: activeTabParam === item.tab ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {activeTabParam === item.tab && (
                                                <motion.div 
                                                    layoutId="active-pill"
                                                    style={{ 
                                                        position: 'absolute', 
                                                        left: 0, 
                                                        top: '20%', 
                                                        bottom: '20%', 
                                                        width: '4px', 
                                                        backgroundColor: '#4f46e5',
                                                        borderRadius: '0 4px 4px 0'
                                                    }} 
                                                />
                                            )}
                                            <div style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '8px',
                                                backgroundColor: activeTabParam === item.tab ? 'white' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: activeTabParam === item.tab ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none'
                                            }}>
                                                <item.icon size={16} />
                                            </div>
                                            {item.name}
                                        </Link>
                                    ))}
                                    <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '1rem 0' }}></div>
                                </div>
                            )}

                            {/* Nav Links */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem', paddingLeft: '1rem' }}>
                                    Menu
                                </div>
                                {navLinks.filter(link => {
                                    const isDashboardPath = location.pathname.toLowerCase().includes('dashboard');
                                    if (link.name.toLowerCase() === 'dashboard' && isDashboardPath) return false;
                                    return true;
                                }).map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '12px',
                                            textDecoration: 'none',
                                            color: location.pathname === link.path ? '#4f46e5' : '#475569',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            backgroundColor: location.pathname === link.path ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            transition: 'all 0.2s',
                                        }}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '8px',
                                            backgroundColor: location.pathname === link.path ? 'white' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: location.pathname === link.path ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none'
                                        }}>
                                            <link.icon size={16} />
                                        </div>
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginBottom: '1.5rem' }}></div>

                            {/* Auth Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                {user ? (
                                    <>
                                        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <div style={{ ...avatarStyle, width: '40px', height: '40px', fontSize: '1.1rem' }}>
                                                {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{user.name || user.username}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'capitalize' }}>{user.role} Account</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                padding: '0.85rem',
                                                color: '#ef4444',
                                                border: '1px solid #fee2e2',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                backgroundColor: '#fff1f1',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <LogOut size={18} /> Sign Out Account
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/student/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '14px', color: '#1e293b', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}
                                        >
                                            <div style={{ color: '#6366f1' }}><UserCircle size={22} /></div> Student Login
                                        </Link>
                                        <Link
                                            to="/teacher/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '14px', color: '#1e293b', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}
                                        >
                                            <div style={{ color: '#ec4899' }}><School size={22} /></div> Teacher Login
                                        </Link>
                                        <Link
                                            to="/admin/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '14px', color: '#475569', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}
                                        >
                                            <div style={{ color: '#64748b' }}><ShieldCheck size={22} /></div> Admin Login
                                        </Link>

                                        <div style={{ marginTop: 'auto' }}>
                                            <Link
                                                to="/student/signup"
                                                onClick={() => setMobileMenuOpen(false)}
                                                style={{
                                                    padding: '1.1rem',
                                                    textAlign: 'center',
                                                    backgroundColor: '#4f46e5',
                                                    color: 'white',
                                                    borderRadius: '14px',
                                                    textDecoration: 'none',
                                                    fontWeight: '700',
                                                    fontSize: '1.1rem',
                                                    display: 'block',
                                                    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
                                                }}
                                            >
                                                Sign Up Free
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mobile-nav-overlay"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 2500
                            }}
                        />
                    </>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-menu-wrapper { display: none !important; }
                    .mobile-menu-toggle { 
                        display: block !important; 
                        margin-right: 0rem !important;
                    }
                    nav {
                        padding: 0 1rem !important;
                    }
                }
                .nav-link-btn:hover {
                    color: #4f46e5 !important;
                }
            `}</style>
        </nav>
    );
};

// Clean Inline Styles
const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '70px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
    padding: '0 2rem', // Responsive edge padding
};

const navContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const brandLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
};

const brandIconStyle = {
    backgroundColor: '#4f46e5',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const brandNameStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a',
};

const desktopMenuWrapper = {
    display: 'flex',
    alignItems: 'center',
};

const navLinkStyle = {
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'color 0.2s'
};

const navLinkButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#475569',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0.5rem',
};

const primaryButtonStyle = {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background-color 0.2s'
};

const profileButtonStyle = {
    background: 'none',
    border: '1px solid #e2e8f0',
    padding: '0.25rem 0.75rem 0.25rem 0.25rem',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
};

const avatarStyle = {
    width: '32px',
    height: '32px',
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.9rem',
};

const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 15px)',
    right: 0,
    width: '200px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
};

const dropdownItemStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    color: '#475569',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    textDecoration: 'none',
};

const mobileToggleStyle = {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#0f172a',
    cursor: 'pointer',
};

export default Navbar;
