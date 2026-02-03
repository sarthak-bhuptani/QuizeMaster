import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Users, BookOpen, UserCheck, Trash2, CheckSquare,
    LayoutDashboard, GraduationCap, Brain, Menu, X, Search, LogOut
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalCourses: 0, pendingTeachers: 0 });
    const [data, setData] = useState({ teachers: [], students: [], courses: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile Menu State

    useEffect(() => {
        const admin = localStorage.getItem('admin');
        if (!admin) navigate('/admin/login');
        loadAllData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/');
    };
    /* ... existing functions ... */

    const loadAllData = async () => {
        setLoading(true);
        try {
            // Fetch Stats
            const statsRes = await axios.get('http://127.0.0.1:5001/api/admin/stats');
            setStats(statsRes.data);

            // Fetch System Data (Students, Teachers, Courses)
            const sysRes = await axios.get('http://127.0.0.1:5001/api/admin/system-data');
            const { teachers = [], students = [], courses = [], questions = [] } = sysRes.data;

            // Dynamically calculate accurate counts/marks for courses
            const processedCourses = courses.map(course => {
                const quizQuestions = questions.filter(q => String(q.course_id) === String(course._id));
                return {
                    ...course,
                    question_number: quizQuestions.length,
                    total_marks: quizQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0)
                };
            });

            setData({
                teachers,
                students,
                courses: processedCourses
            });
        } catch (error) {
            console.error("Error loading admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    // ... (keep approveTeacher, deleteEntity, filterData, StatCard, etc as is)

    const approveTeacher = async (id) => {
        try {
            await axios.put(`http://127.0.0.1:5001/api/admin/approve-teacher/${id}`);
            alert('Teacher Approved');
            loadAllData();
        } catch (err) { alert('Action failed'); }
    };

    const deleteEntity = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            await axios.delete(`http://127.0.0.1:5001/api/admin/delete-${type}/${id}`);
            alert(`${type} deleted`);
            loadAllData();
        } catch (err) { alert('Delete failed'); }
    };

    const filterData = (list) => {
        if (!searchTerm) return list;
        return list.filter(item =>
            (item.user?.username || item.username || item.title || item.course_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.user?.first_name || item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
            className={`nav-btn ${activeTab === id ? 'active' : ''}`}
        >
            <Icon size={20} />
            <span className="nav-label">{label}</span>
        </button>
    );

    const StatCard = ({ label, value, icon: Icon, colorClass }) => (
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
            <div className={`p-3 rounded-xl ${colorClass.replace('text-', 'bg-')}-soft`} style={{ padding: '1rem', borderRadius: '12px' }}>
                <Icon size={28} className={colorClass} />
            </div>
            <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{value}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }} className="text-secondary">{label}</p>
            </div>
        </div>
    );

    // ... (keep create teacher modal logic)

    const [showCreateTeacherModal, setShowCreateTeacherModal] = useState(false);
    const [newTeacher, setNewTeacher] = useState({
        first_name: '', last_name: '', username: '', password: '', mobile: '', address: ''
    });

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5001/api/teacher/signup', { ...newTeacher, status: true });
            alert('Teacher Created Successfully');
            setShowCreateTeacherModal(false);
            setNewTeacher({ first_name: '', last_name: '', username: '', password: '', mobile: '', address: '' });
            loadAllData();
        } catch (err) {
            alert(err.response?.data?.message || 'Creation failed');
        }
    };

    return (
        <div className="dashboard-container">
            {/* Mobile Overlay */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />

            {/* Sidebar */}
            <div className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                <div style={{ padding: '2rem 1.5rem 1rem', display: 'flex', alignItems: 'center', justifyItems: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Brain size={20} color="white" />
                        </div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '-0.5px', color: '#fff' }}>QuizeMaster</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="hide-on-desktop show-on-mobile-flex" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                        Admin Portal
                    </div>
                </div>

                <div className="nav-items-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <TabButton id="overview" label="Overview" icon={LayoutDashboard} />
                    <TabButton id="students" label="Students" icon={Users} />
                    <TabButton id="teachers" label="Teachers" icon={GraduationCap} />
                    <TabButton id="courses" label="Quizzes" icon={BookOpen} />
                </div>

                <div style={{ padding: '0 1.5rem', marginTop: 'auto', width: '100%' }}>
                    <button
                        onClick={handleLogout}
                        className="btn-danger-soft"
                        style={{
                            width: '100%', padding: '0.8rem', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '0.8rem', cursor: 'pointer', fontWeight: 600, transition: '0.3s'
                        }}
                    >
                        <LogOut size={18} /> <span className="nav-label">Logout Session</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                <button
                    className="mobile-menu-btn hide-on-desktop"
                    onClick={() => setSidebarOpen(true)}
                    style={{ display: 'none' }} // Controlled by CSS media queries
                >
                    <Menu size={24} />
                </button>

                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 className="section-title">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p className="text-secondary">Manage your system efficiently</p>
                    </div>
                    {activeTab === 'teachers' && (
                        <button
                            onClick={() => setShowCreateTeacherModal(true)}
                            className="btn btn-primary"
                        >
                            <Users size={18} /> Add New Teacher
                        </button>
                    )}
                </div>

                {activeTab !== 'overview' && (
                    <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '400px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '3rem' }}
                        />
                    </div>
                )}

                {/* Content Views */}
                {loading ? (
                    <div className="text-secondary">Loading system data...</div>
                ) : (
                    <>
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <>
                                <div className="stats-grid">
                                    <StatCard label="Total Students" value={stats.totalStudents} icon={Users} colorClass="text-success" />
                                    <StatCard label="Total Teachers" value={stats.totalTeachers} icon={GraduationCap} colorClass="text-primary" />
                                    <StatCard label="Active Quizzes" value={stats.totalCourses} icon={BookOpen} colorClass="text-accent" />
                                    <StatCard label="Pending Approvals" value={stats.pendingTeachers} icon={UserCheck} colorClass="text-warning" />
                                </div>

                                {/* Analytics Section */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                                    {/* Growth Trends Chart */}
                                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <Users size={20} className="text-primary" /> User Growth Trends
                                        </h3>
                                        <div style={{ height: 300, width: '100%' }}>
                                            <ResponsiveContainer>
                                                <AreaChart data={[
                                                    { name: 'Jan', students: 40, teachers: 24 },
                                                    { name: 'Feb', students: 30, teachers: 13 },
                                                    { name: 'Mar', students: 20, teachers: 58 },
                                                    { name: 'Apr', students: 27, teachers: 39 },
                                                    { name: 'May', students: 18, teachers: 48 },
                                                    { name: 'Jun', students: 23, teachers: 38 },
                                                    { name: 'Jul', students: 34, teachers: 43 },
                                                ]}>
                                                    <defs>
                                                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                                        itemStyle={{ color: '#fff' }}
                                                    />
                                                    <Area type="monotone" dataKey="students" stroke="#82ca9d" fillOpacity={1} fill="url(#colorStudents)" />
                                                    <Area type="monotone" dataKey="teachers" stroke="#8884d8" fillOpacity={1} fill="url(#colorTeachers)" />
                                                    <Legend />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Platform Distribution Radar */}
                                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <BookOpen size={20} className="text-accent" /> Assessment Category Radar
                                        </h3>
                                        <div style={{ height: 300, width: '100%' }}>
                                            <ResponsiveContainer>
                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                                    { subject: 'Math', A: 120, fullMark: 150 },
                                                    { subject: 'Science', A: 98, fullMark: 150 },
                                                    { subject: 'English', A: 86, fullMark: 150 },
                                                    { subject: 'Geography', A: 99, fullMark: 150 },
                                                    { subject: 'Physics', A: 85, fullMark: 150 },
                                                    { subject: 'History', A: 65, fullMark: 150 },
                                                ]}>
                                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                                    <Radar name="Quiz Distribution" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                                        itemStyle={{ color: '#fff' }}
                                                    />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}


                        {/* STUDENTS TAB */}
                        {activeTab === 'students' && (
                            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Username</th>
                                                <th>Mobile</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filterData(data.students).map(student => (
                                                <tr key={student._id}>
                                                    <td style={{ fontWeight: 500 }}>{student.user?.first_name} {student.user?.last_name}</td>
                                                    <td className="text-secondary">@{student.user?.username}</td>
                                                    <td>{student.mobile || 'N/A'}</td>
                                                    <td>
                                                        <button onClick={() => deleteEntity('student', student._id)} className="btn btn-outline" style={{ color: 'var(--danger)', padding: '0.5rem' }}>
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TEACHERS TAB */}
                        {activeTab === 'teachers' && (
                            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Username</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filterData(data.teachers).map(teacher => (
                                                <tr key={teacher._id}>
                                                    <td style={{ fontWeight: 500 }}>{teacher.user?.first_name} {teacher.user?.last_name}</td>
                                                    <td className="text-secondary">@{teacher.user?.username}</td>
                                                    <td>
                                                        {teacher.status ? (
                                                            <span className="bg-success-soft" style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>Active</span>
                                                        ) : (
                                                            <span className="bg-warning-soft" style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>Pending</span>
                                                        )}
                                                    </td>
                                                    <td style={{ display: 'flex', gap: '0.8rem' }}>
                                                        {!teacher.status && (
                                                            <button onClick={() => approveTeacher(teacher._id)} className="bg-success-soft" style={{ border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }} title="Approve">
                                                                <CheckSquare size={18} />
                                                            </button>
                                                        )}
                                                        <button onClick={() => deleteEntity('teacher', teacher._id)} className="bg-danger-soft" style={{ border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }} title="Delete">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* QUIZZES TAB */}
                        {activeTab === 'courses' && (
                            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Quiz Name</th>
                                                <th>Questions</th>
                                                <th>Marks</th>
                                                <th>Time (mins)</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filterData(data.courses).map(course => (
                                                <tr key={course._id}>
                                                    <td style={{ fontWeight: 500 }}>{course.course_name}</td>
                                                    <td className="text-secondary">{course.question_number}</td>
                                                    <td className="text-secondary">{course.total_marks}</td>
                                                    <td className="text-secondary">{course.time_limit || 30} mins</td>
                                                    <td>
                                                        <button onClick={() => deleteEntity('course', course._id)} className="bg-danger-soft" style={{ border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create Teacher Modal */}
            <AnimatePresence>
                {showCreateTeacherModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card"
                            style={{ width: '90%', maxWidth: '500px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Add New Teacher</h2>
                                <button onClick={() => setShowCreateTeacherModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleCreateTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>First Name</label>
                                        <input type="text" required value={newTeacher.first_name} onChange={e => setNewTeacher({ ...newTeacher, first_name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Last Name</label>
                                        <input type="text" required value={newTeacher.last_name} onChange={e => setNewTeacher({ ...newTeacher, last_name: e.target.value })} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Username</label>
                                        <input type="text" required value={newTeacher.username} onChange={e => setNewTeacher({ ...newTeacher, username: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
                                        <input type="password" required value={newTeacher.password} onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Mobile Number</label>
                                    <input type="text" required value={newTeacher.mobile} onChange={e => setNewTeacher({ ...newTeacher, mobile: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Address</label>
                                    <input type="text" value={newTeacher.address} onChange={e => setNewTeacher({ ...newTeacher, address: e.target.value })} />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Teacher Account</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
