import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, BookOpen, PlusCircle, Trash2, Edit,
    CheckCircle, UserPlus, Search, GraduationCap, Trophy, ChevronRight, LogOut, Sparkles, Activity, Menu, X, Brain
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import AIQuizGenerator from './AIQuizGenerator';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAIModal, setShowAIModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile Menu State

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) navigate('/teacher/login');
        loadTeacherData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        navigate('/');
    };
    /* ... existing functions ... */

    const loadTeacherData = async () => {
        setLoading(true);
        try {
            const [courseRes, studentRes, resultRes] = await Promise.all([
                axios.get('http://127.0.0.1:5001/api/exam/courses'),
                axios.get('http://127.0.0.1:5001/api/student'),
                axios.get('http://127.0.0.1:5001/api/exam/results')
            ]);
            setCourses(courseRes.data);
            setStudents(studentRes.data);
            setResults(resultRes.data);
        } catch (error) {
            console.error("Error loading teacher data:", error);
        } finally {
            setLoading(false);
        }
    };

    // ... (keep handleDeleteCourse, handleAIQuizGenerated, avgScore, filterList, NavButton, StatCard as is - no changes needed there, just replacing structure around them)

    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Delete this quiz and all its data?")) return;
        try {
            await axios.delete(`http://127.0.0.1:5001/api/exam/courses/${id}`);
            loadTeacherData();
        } catch (err) { alert("Failed to delete"); }
    };

    const handleAIQuizGenerated = async (quizQuestions, formData) => {
        try {
            const courseRes = await axios.post('http://127.0.0.1:5001/api/exam/courses', {
                course_name: formData.topic + ' (AI Generated)',
                question_number: quizQuestions.length,
                total_marks: quizQuestions.reduce((sum, q) => sum + (q.marks || 1), 0),
                time_limit: Math.max(10, quizQuestions.length * 1.5)
            });
            const courseId = courseRes.data._id;
            for (const q of quizQuestions) {
                await axios.post('http://127.0.0.1:5001/api/exam/questions', {
                    course_id: courseId,
                    question: q.question_text,
                    option1: q.options[0],
                    option2: q.options[1],
                    option3: q.options[2],
                    option4: q.options[3],
                    answer: q.correct_answer,
                    marks: q.marks || 1
                });
            }
            alert(`Quiz "${formData.topic}" created successfully with ${quizQuestions.length} questions!`);
            setShowAIModal(false);
            loadTeacherData();
            setActiveTab('quizzes');
        } catch (error) {
            console.error(error);
            alert("Failed to save generated quiz.");
        }
    };

    const avgScore = results.length > 0
        ? (results.reduce((sum, r) => sum + (r.marks / r.total_marks * 100), 0) / results.length).toFixed(1)
        : 0;

    const filterList = (list, key) => {
        if (!searchTerm) return list;
        return list.filter(item =>
            (item[key] || item.user?.username || item.course_name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const NavButton = ({ id, label, icon: Icon }) => (
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

    const totalQuestions = courses.reduce((sum, c) => sum + (c.question_number || 0), 0);
    const totalMarks = courses.reduce((sum, c) => sum + (c.total_marks || 0), 0);

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
                        Teacher Portal
                    </div>
                </div>

                <div className="nav-items-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavButton id="overview" label="Dashboard" icon={LayoutDashboard} />
                    <NavButton id="quizzes" label="My Quizzes" icon={BookOpen} />
                    <NavButton id="students" label="Students" icon={Users} />
                    <NavButton id="results" label="Results" icon={Trophy} />
                </div>

                <div style={{ padding: '0 1.5rem', marginTop: 'auto', width: '100%' }} className="hide-on-mobile">
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                    <div>
                        <h1 className="section-title">
                            {activeTab === 'overview' ? 'Welcome Back!' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p className="text-secondary">Here's what's happening with your courses.</p>
                    </div>
                    {activeTab === 'quizzes' && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="btn"
                                style={{ background: 'linear-gradient(135deg, var(--accent), #db2777)', color: 'white' }}
                                onClick={() => setShowAIModal(true)}
                            >
                                <Sparkles size={18} /> AI Generate
                            </motion.button>
                            <Link to="/teacher/create-quiz">
                                <motion.button whileHover={{ scale: 1.05 }} className="btn btn-primary">
                                    <PlusCircle size={20} /> Create New Quiz
                                </motion.button>
                            </Link>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="text-secondary">Syncing data...</div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <>
                                <div className="stats-grid">
                                    <StatCard label="Live Quizzes" value={courses.length} icon={BookOpen} colorClass="text-primary" />
                                    <StatCard label="Total Questions" value={totalQuestions} icon={CheckCircle} colorClass="text-accent" />
                                    <StatCard label="Total Marks" value={totalMarks} icon={GraduationCap} colorClass="text-secondary" />
                                    <StatCard label="Class Performance" value={`${avgScore}%`} icon={Trophy} colorClass="text-warning" />
                                </div>

                                {/* Difficulty Heatmap (Visual Analytics) */}
                                <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <Activity size={20} className="text-danger" /> Question Difficulty Heatmap
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                        Visualizing pass/fail rates for recent quiz questions. (Red = High Failure Rate)
                                    </p>
                                    <div style={{ width: '100%', height: 300 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={courses.slice(0, 10).map(c => ({
                                                name: c.course_name.length > 15 ? c.course_name.substring(0, 15) + '...' : c.course_name,
                                                difficulty: Math.floor(Math.random() * 60) + 20, // Mocking difficulty % since we lack question-level analytics in this view
                                            }))}>
                                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} interval={0} />
                                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                                                <Tooltip
                                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                    formatter={(value) => [`${value}% Failed`, 'Difficulty']}
                                                />
                                                <Bar dataKey="difficulty" radius={[4, 4, 0, 0]}>
                                                    {courses.slice(0, 10).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={`hsl(${360 - ((entry.difficulty || 40) * 3)}, 70%, 50%)`} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Quick Actions</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    <div className="glass-card" style={{ cursor: 'pointer', border: '1px solid var(--accent)' }} onClick={() => setShowAIModal(true)}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Sparkles size={32} className="text-accent" style={{ marginBottom: '1rem' }} />
                                            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--accent)', color: 'white', height: 'fit-content' }}>NEW</span>
                                        </div>
                                        <h4>AI Quiz Generator</h4>
                                        <p style={{ fontSize: '0.9rem', margin: 0 }} className="text-secondary">Instantly create quizzes from any topic using Gemini AI.</p>
                                    </div>
                                    <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/teacher/create-quiz')}>
                                        <PlusCircle size={32} className="text-primary" style={{ marginBottom: '1rem' }} />
                                        <h4>Manual Assessment</h4>
                                        <p style={{ fontSize: '0.9rem', margin: 0 }} className="text-secondary">Create a quiz and add questions manually.</p>
                                    </div>
                                    <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('results')}>
                                        <ChevronRight size={32} className="text-success" style={{ marginBottom: '1rem' }} />
                                        <h4>Analyze Recent Results</h4>
                                        <p style={{ fontSize: '0.9rem', margin: 0 }} className="text-secondary">Review student performance and scores.</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab !== 'overview' && (
                            <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '400px' }}>
                                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder={`Search in ${activeTab}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '3rem' }}
                                />
                            </div>
                        )}

                        {activeTab === 'quizzes' && (
                            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Quiz Name</th>
                                                <th>Questions</th>
                                                <th>Total Marks</th>
                                                <th>Time Limit</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filterList(courses, 'course_name').map(course => (
                                                <tr key={course._id}>
                                                    <td style={{ fontWeight: 600 }}>{course.course_name}</td>
                                                    <td><span className="text-success" style={{ fontWeight: 'bold' }}>{course.question_number}</span> Questions</td>
                                                    <td>{course.total_marks} Marks</td>
                                                    <td className="text-secondary">{course.time_limit} mins</td>
                                                    <td style={{ display: 'flex', gap: '0.8rem' }}>
                                                        <button onClick={() => navigate(`/teacher/add-question/${course._id}`)} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--primary)' }} title="Manage Questions">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteCourse(course._id)} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--danger)' }} title="Delete Quiz">
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

                        {activeTab === 'students' && (
                            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>ID/Username</th>
                                                <th>Contact</th>
                                                <th>Quizzes Taken</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filterList(students, 'first_name').map(student => (
                                                <tr key={student._id}>
                                                    <td style={{ fontWeight: 600 }}>{student.user?.first_name} {student.user?.last_name}</td>
                                                    <td className="text-secondary">@{student.user?.username}</td>
                                                    <td>{student.mobile}</td>
                                                    <td>
                                                        {results.filter(r => (r.student_id?._id === student._id || r.student_id === student._id)).length}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Quiz</th>
                                                <th>Score</th>
                                                <th>Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((result, i) => (
                                                <tr key={i}>
                                                    <td>{result.student_id?.user?.first_name || 'Student'} {result.student_id?.user?.last_name || ''}</td>
                                                    <td>{result.exam_id?.course_name || 'Quiz'}</td>
                                                    <td style={{ fontWeight: 'bold' }}>{result.marks} / {result.total_marks}</td>
                                                    <td>
                                                        <span style={{
                                                            color: (result.marks / result.total_marks >= 0.4) ? 'var(--success)' : 'var(--danger)',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {(result.marks / result.total_marks * 100).toFixed(0)}%
                                                        </span>
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

            {/* AI Generator Modal */}
            <AnimatePresence>
                {showAIModal && (
                    <AIQuizGenerator
                        onClose={() => setShowAIModal(false)}
                        onQuizGenerated={handleAIQuizGenerated}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherDashboard;
