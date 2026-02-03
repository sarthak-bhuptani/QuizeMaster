import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, BookOpen, Trophy, Activity, Clock,
    ArrowRight, Search, Zap, Award, User, Bell,
    ChevronRight, Target, Flame, LogOut
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [courses, setCourses] = useState([]);
    const [myResults, setMyResults] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/student/login');
            return;
        }
        const currentUser = JSON.parse(storedUser);
        setUser(currentUser);
        loadStudentData(currentUser.studentId);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        navigate('/');
    };

    const loadStudentData = async (studentId) => {
        setLoading(true);
        try {
            const [courseRes, resultRes, leaderboardRes] = await Promise.all([
                axios.get('http://127.0.0.1:5001/api/exam/courses'),
                axios.get(`http://127.0.0.1:5001/api/exam/results/student/${studentId}`),
                axios.get('http://127.0.0.1:5001/api/exam/results')
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
            onClick={() => setActiveTab(id)}
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
            <div className="dashboard-sidebar">
                <div style={{ padding: '0 1.5rem 2.5rem' }} className="hide-on-mobile">
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1.5rem' }}>Learning Path</div>
                    <NavButton id="overview" label="My Overview" icon={LayoutDashboard} />
                    <NavButton id="exams" label="Available Exams" icon={BookOpen} />
                    <NavButton id="history" label="Result History" icon={Activity} />
                    <NavButton id="leaderboard" label="Hall of Fame" icon={Trophy} />
                </div>

                <div style={{ padding: '0 1.5rem', marginTop: '1rem' }} className="hide-on-mobile">
                    <div className="glass-card" style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(99, 102, 241, 0.1))', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Streak</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Flame size={18} className="text-warning" fill="currentColor" fillOpacity={0.2} />
                            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>4 Days</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', padding: '1.5rem' }} className="hide-on-mobile">
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 className="section-title">
                            Hello, {user?.name?.split(' ')[0] || 'Explorer'}! 👋
                        </h1>
                        <p className="text-secondary">Ready to conquer your assessments today?</p>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        {/* Gamification Stats */}
                        <div style={{ textAlign: 'right' }} className="hide-on-mobile">
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>LEVEL {user?.level || 1}</div>
                            <div style={{ width: '150px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${(user?.xp % 100) || 0}%`, height: '100%', background: 'var(--primary)' }}></div>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.2rem', fontWeight: 'bold' }}>{user?.xp || 0} XP</div>
                        </div>

                        <div style={{ textAlign: 'right', marginRight: '1rem' }} className="hide-on-mobile">
                            <div style={{ fontSize: '0.8rem' }} className="text-secondary">Badges Unlocked</div>
                            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }} className="text-warning">
                                <Trophy size={16} /> {user?.badges?.length || 0}
                            </div>
                        </div>
                        <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', border: '2px solid rgba(255,255,255,0.1)' }}>
                            {user?.name?.[0] || 'S'}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-secondary">Preparing your portal...</div>
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

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
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
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {courses.filter(c => c.course_name.toLowerCase().includes(searchTerm.toLowerCase())).map(course => (
                                        <div key={course._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem' }}>
                                            <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem' }}>
                                                {course.course_name[0]}
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{course.course_name}</h3>
                                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }} className="text-secondary">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {course.time_limit}m</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Target size={14} /> {course.total_marks} Pts</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><BookOpen size={14} /> {course.question_number}q</div>
                                                </div>
                                            </div>
                                            <Link to={`/student/take-quiz/${course._id}`} style={{ marginTop: 'auto' }}>
                                                <button className="btn btn-primary" style={{ width: '100%' }}>
                                                    Begin Exam <ArrowRight size={18} />
                                                </button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activeTab === 'history' && (
                            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
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
                            </div>
                        )}

                        {activeTab === 'leaderboard' && (
                            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                    <h2 className="section-title">Global Leaderboard</h2>
                                    <p className="text-secondary">Honoring the top performers of the academy.</p>
                                </div>
                                <div className="glass-card">
                                    {leaderboard.length === 0 ? (
                                        <div style={{ padding: '3rem', textAlign: 'center' }} className="text-secondary">No rankings available yet.</div>
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
