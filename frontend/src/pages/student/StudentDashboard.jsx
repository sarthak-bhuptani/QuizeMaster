import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, BookOpen, Trophy, Activity, Clock,
    ArrowRight, Search, Zap, Award, User, Bell,
    ChevronRight, Target, Flame, LogOut, Sparkles, Brain
} from 'lucide-react';
import api from '../../services/api';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
    const [courses, setCourses] = useState([]);
    const [myResults, setMyResults] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);

    // Sync state with URL params
    useEffect(() => {
        const tab = searchParams.get('tab') || 'overview';
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (newTab) => {
        setSearchParams({ tab: newTab });
        setActiveTab(newTab);
    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
            navigate('/student/login');
            return;
        }
        const currentUser = JSON.parse(storedUser);
        if (!currentUser.studentId) {
            navigate('/student/login');
            return;
        }
        setUser(currentUser);
        loadStudentData(currentUser.studentId);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('admin');
        navigate('/');
    };

    const loadStudentData = async (studentId) => {
        setLoading(true);
        try {
            const [courseRes, resultRes, leaderboardRes] = await Promise.all([
                api.get('/exam/courses'),
                api.get(`/exam/results/student/${studentId}`),
                api.get('/exam/results?ranking=true')
            ]);
            setCourses(courseRes.data);
            setMyResults(resultRes.data);
            setLeaderboard(leaderboardRes.data);
        } catch (error) {
            console.error("Error loading student data:", error);
        } finally {
            setLoading(false);
        }
    };

    const myRank = leaderboard.findIndex(entry =>
        entry.student_id?._id === user?.studentId || entry.student_id === user?.studentId
    );

    const stats = {
        totalExams: myResults.length,
        avgScore: myResults.length > 0
            ? Math.round(myResults.reduce((acc, curr) => acc + (curr.marks / curr.total_marks * 100), 0) / myResults.length)
            : 0,
        passed: myResults.filter(r => (r.marks / r.total_marks) >= 0.4).length,
        rank: myRank !== -1 ? `#${myRank + 1}` : 'NR'
    };

    const NavButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => handleTabChange(id)}
            className={`nav-btn ${activeTab === id ? 'active' : ''}`}
        >
            <Icon size={20} />
            <span className="nav-label">{label}</span>
        </button>
    );

    const StatCard = ({ label, value, sub, icon: Icon, colorClass }) => (
        <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }} className={colorClass}>
                <Icon size={80} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('text', 'bg')}-soft`} style={{ padding: '0.6rem', borderRadius: '10px' }}>
                    <Icon size={20} className={colorClass} />
                </div>
                <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{label}</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }} className="text-primary">{value}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }} className="text-silver">{sub}</div>
        </div>
    );

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="dashboard-sidebar hide-on-mobile">

                <div className="nav-items-container">
                    <NavButton id="overview" label="My Overview" icon={LayoutDashboard} />
                    <NavButton id="exams" label="Available Exams" icon={BookOpen} />
                    <NavButton id="history" label="Result History" icon={Activity} />
                    <NavButton id="leaderboard" label="Hall of Fame" icon={Trophy} />
                </div>

                <div className="hide-on-mobile" style={{ padding: '0 1rem', marginTop: '1rem' }}>
                    <div className="glass-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(99, 102, 241, 0.15))', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Streak</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Flame size={18} className="text-warning" fill="currentColor" fillOpacity={0.2} />
                            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>4 Days</span>
                        </div>
                    </div>
                </div>

                <div className="hide-on-mobile" style={{ padding: '1rem', marginTop: 'auto', width: '100%' }}>
                    <button
                        onClick={handleLogout}
                        className="btn-danger-soft"
                        style={{
                            width: '100%', padding: '0.8rem', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '0.8rem', cursor: 'pointer', fontWeight: 600, transition: '0.3s'
                        }}
                    >
                        <LogOut size={16} /> <span className="nav-label">Logout Session</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">

                <div className="dashboard-header-flex">
                    <div style={{ flex: 1 }}>
                        <h1 className="section-title" style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', marginBottom: '0.2rem' }}>
                            Hello, {user?.name?.split(' ')[0] || 'Explorer'}! 👋
                        </h1>
                        <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }} className="hide-on-mobile">
                            <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.9rem' }}>{user?.name || user?.username}</div>
                            <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: '800', textTransform: 'uppercase' }}>Student Profile</div>
                        </div>
                        <div className="user-avatar-circle">
                            {(user?.name?.[0] || user?.username?.[0] || 'S').toUpperCase()}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="stats-grid">
                            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton skeleton-box" style={{ height: 120, marginBottom: 0 }}></div>)}
                        </div>
                        <div className="skeleton skeleton-box" style={{ height: 350 }}></div>
                    </motion.div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <>
                                <div className="stats-grid">
                                    <StatCard label="Avg. Score" value={`${stats.avgScore}%`} sub="Across all exams" icon={Target} colorClass="text-secondary" />
                                    <StatCard label="Exams Taken" value={stats.totalExams} sub="Historical data" icon={Activity} colorClass="text-success" />
                                    <StatCard label="Quizzes Passed" value={stats.passed} sub="Above 40% threshold" icon={Award} colorClass="text-warning" />
                                    <StatCard label="Current Rank" value={stats.rank} sub="Based on marks" icon={Trophy} colorClass="text-danger" />
                                </div>

                                {/* Performance Curve Chart */}
                                <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <Activity size={20} className="text-primary" /> Performance Curve
                                    </h3>
                                    <div style={{ width: '100%', height: 300 }}>
                                        <ResponsiveContainer>
                                            <LineChart data={myResults.slice(-5).map((r, i) => ({
                                                name: `Quiz ${i + 1}`,
                                                score: Math.round((r.marks / r.total_marks) * 100),
                                                exam: r.exam_id?.course_name || 'Quiz'
                                            }))}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[0, 100]} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                    formatter={(value) => [`${value}%`, 'Score']}
                                                    labelStyle={{ color: '#94a3b8' }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="score"
                                                    stroke="var(--primary)"
                                                    strokeWidth={3}
                                                    dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                    <div className="glass-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                            <h3 style={{ margin: 0 }}>Recommended for You</h3>
                                            <button onClick={() => setActiveTab('exams')} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                                                View All <ChevronRight size={16} />
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {courses.slice(0, 3).map(course => (
                                                <div key={course._id} className="item-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', transition: 'transform 0.2s' }}>
                                                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                                                        {course.course_name[0]}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>{course.course_name}</div>
                                                        <div style={{ fontSize: '0.8rem' }} className="text-secondary">{course.question_number} Questions • {course.time_limit} Mins</div>
                                                    </div>
                                                    <Link to={`/student/take-quiz/${course._id}`}>
                                                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Start</button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="glass-card">
                                        <h3 style={{ margin: 0, marginBottom: '2rem' }}>Rankings</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                            {leaderboard.slice(0, 5).map((entry, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '24px', fontWeight: 'bold' }} className={idx < 3 ? "text-warning" : "text-secondary"}>#{idx + 1}</div>
                                                    <div style={{ flex: 1, fontSize: '0.9rem' }}>{entry.student_id?.user?.first_name || 'Student'}</div>
                                                    <div style={{ fontWeight: 'bold' }} className="text-success">{entry.marks}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => setActiveTab('leaderboard')} className="btn btn-outline" style={{ width: '100%', marginTop: '2rem' }}>See Full Leaderboard</button>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'exams' && (
                            <>
                                <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '450px' }}>
                                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="text"
                                        placeholder="Find an exam..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ paddingLeft: '3.5rem' }}
                                    />
                                </div>
                                {courses.filter(c => c.course_name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="empty-state">
                                        <div className="empty-state-icon"><BookOpen size={36} /></div>
                                        <h3>No Exams Found</h3>
                                        <p>There are currently no exams available to take at the moment. Keep an eye out for updates!</p>
                                    </motion.div>
                                ) : (
                                    <div className="exam-cards-grid">
                                        {courses.filter(c => c.course_name.toLowerCase().includes(searchTerm.toLowerCase())).map((course, idx) => {
                                            const accents = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#f97316'];
                                            const accent = accents[idx % accents.length];
                                            const alreadyDone = myResults.some(r => r.exam_id?._id === course._id || r.exam_id === course._id);
                                            return (
                                                <div key={course._id} className="exam-card-simple" style={{ borderLeftColor: accent }}>
                                                    <div className="exam-card-simple-top">
                                                        <div className="exam-card-icon" style={{ background: `${accent}18`, color: accent }}>
                                                            {course.course_name[0].toUpperCase()}
                                                        </div>
                                                        {alreadyDone && <span className="exam-attempted-tag">Done</span>}
                                                    </div>

                                                    <h3 className="exam-card-name">{course.course_name}</h3>

                                                    <div className="exam-card-meta">
                                                        <span><Clock size={13} /> {course.time_limit} min</span>
                                                        <span><Target size={13} /> {course.total_marks} pts</span>
                                                        <span><BookOpen size={13} /> {course.question_number} Qs</span>
                                                    </div>

                                                    <Link to={`/student/take-quiz/${course._id}`}>
                                                        <button className="exam-card-btn" style={{ borderColor: accent, color: accent }}>
                                                            {alreadyDone ? 'Retake' : 'Start Exam'} <ArrowRight size={15} />
                                                        </button>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'history' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: myResults.length === 0 ? '2rem' : 0, overflow: 'hidden' }}>
                                {myResults.length === 0 ? (
                                    <div className="empty-state" style={{ border: 'none', background: 'transparent', margin: 0 }}>
                                        <div className="empty-state-icon"><Activity size={36} /></div>
                                        <h3>No History Yet</h3>
                                        <p>You haven't taken any exams yet. Head over to the Available Exams tab to get started!</p>
                                        <button className="btn btn-primary" onClick={() => setActiveTab('exams')} style={{ marginTop: '1rem' }}>Browse Exams <ArrowRight size={16}/></button>
                                    </div>
                                ) : (
                                    <div className="table-container">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Exam Name</th>
                                                    <th>Date</th>
                                                    <th>Score / Total</th>
                                                    <th>Result</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myResults.map((res, i) => (
                                                    <tr key={i}>
                                                        <td style={{ fontWeight: 'bold' }}>{res.exam_id?.course_name || 'Quiz'}</td>
                                                        <td className="text-secondary">{new Date(res.date).toLocaleDateString()}</td>
                                                        <td>{res.marks} / {res.total_marks}</td>
                                                        <td>
                                                            <span className={res.marks / res.total_marks >= 0.4 ? "bg-success-soft" : "bg-danger-soft"} style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                                {res.marks / res.total_marks >= 0.4 ? 'PASSED' : 'RETAKE'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button onClick={() => navigate(`/student/analysis/${res._id}`)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Analysis</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'leaderboard' && (
                            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                    <h2 className="section-title">Global Leaderboard</h2>
                                    <p className="text-secondary">Honoring the top performers of the academy.</p>
                                </div>
                                <div className="glass-card">
                                    {leaderboard.length === 0 ? (
                                        <div className="empty-state" style={{ border: 'none', background: 'transparent', margin: 0 }}>
                                            <div className="empty-state-icon"><Trophy size={36} /></div>
                                            <h3>Leaderboard Empty</h3>
                                            <p>No rankings available yet. Be the first to take a quiz and claim the #1 spot!</p>
                                        </div>
                                    ) : (
                                        leaderboard.map((entry, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem', borderBottom: idx === leaderboard.length - 1 ? 'none' : '1px solid var(--glass-border)', background: (entry.student_id?._id === user?.studentId || entry.student_id === user?.studentId) ? 'var(--primary-dim)' : 'transparent', borderRadius: (entry.student_id?._id === user?.studentId || entry.student_id === user?.studentId) ? '12px' : 0 }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 800, width: '40px' }} className={idx === 0 ? 'text-warning' : idx === 1 ? 'text-silver' : idx === 2 ? 'text-danger' : 'text-secondary'}>#{idx + 1}</div>
                                                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                    {entry.student_id?.user?.first_name?.[0] || 'S'}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold' }}>{entry.student_id?.user?.first_name || 'Academic'} {entry.student_id?.user?.last_name || 'Student'}</div>
                                                    <div style={{ fontSize: '0.8rem' }} className="text-secondary">{entry.exam_id?.course_name || 'General Quiz'}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="text-success">{entry.marks || 0}</div>
                                                    <div style={{ fontSize: '0.7rem' }} className="text-secondary">POINTS</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div >
    );
};

export default StudentDashboard;
