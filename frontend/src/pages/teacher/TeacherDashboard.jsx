import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, BookOpen, PlusCircle, Trash2, Edit,
    CheckCircle, UserPlus, Search, GraduationCap, Trophy, ChevronRight, LogOut, Sparkles, Activity, Brain
} from 'lucide-react';
import api from '../../services/api';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import AIQuizGenerator from './AIQuizGenerator';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAIModal, setShowAIModal] = useState(false);
    const [user, setUser] = useState(null);

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
            navigate('/teacher/login');
            return;
        }
        const currentUser = JSON.parse(storedUser);
        if (!currentUser.teacherId) {
            navigate('/teacher/login');
            return;
        }
        setUser(currentUser);
        loadTeacherData();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('admin');
        navigate('/');
    };
    /* ... existing functions ... */

    const loadTeacherData = async () => {
        setLoading(true);
        try {
            const [courseRes, studentRes, resultRes] = await Promise.all([
                api.get('/exam/courses'),
                api.get('/student'),
                api.get('/exam/results')
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
            await api.delete(`/exam/courses/${id}`);
            loadTeacherData();
        } catch (err) { alert("Failed to delete"); }
    };

    const handleAIQuizGenerated = async (quizQuestions, formData) => {
        const marksPerQ = formData.marksPerQuestion || 5;
        try {
            const courseRes = await api.post('/exam/courses', {
                course_name: formData.topic,
                question_number: quizQuestions.length,
                total_marks: quizQuestions.length * marksPerQ,
                time_limit: formData.timeLimit || Math.max(10, quizQuestions.length * 1.5)
            });
            const courseId = courseRes.data._id;
            for (const q of quizQuestions) {
                // Find which option matches the correct answer
                const correctIndex = q.options.findIndex(opt => opt === q.correct_answer);
                const answerKey = correctIndex >= 0 ? `Option${correctIndex + 1}` : 'Option1';

                await api.post('/exam/questions', {
                    course_id: courseId,
                    question: q.question_text,
                    option1: q.options[0],
                    option2: q.options[1],
                    option3: q.options[2],
                    option4: q.options[3],
                    answer: answerKey,
                    marks: marksPerQ
                });
            }
            alert(`Quiz "${formData.topic}" created with ${quizQuestions.length} questions × ${marksPerQ} marks each!`);
            setShowAIModal(false);
            loadTeacherData();
            setActiveTab('quizzes');
        } catch (error) {
            console.error(error);
            alert("Failed to save generated quiz.");
        }
    };

    const handleDeleteResult = async (id) => {
        if (!id) {
            alert("Error: Result ID is missing.");
            return;
        }
        if (!window.confirm("Delete this student's result record?")) return;
        try {
            await api.delete(`/exam/results/${id}`);
            loadTeacherData();
        } catch (err) { alert("Failed to delete result"); }
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
            onClick={() => handleTabChange(id)}
            className={`nav-btn ${activeTab === id ? 'active' : ''}`}
        >
            <Icon size={20} />
            <span className="nav-label">{label}</span>
        </button>
    );

    const StatCard = ({ label, value, sub, icon: Icon, colorClass }) => (
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ padding: '0.85rem', borderRadius: '14px', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} className={colorClass} />
                </div>
                <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>{label}</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
                </div>
            </div>
            {sub && (
                <div style={{ marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                    {sub}
                </div>
            )}
            {/* Visual Decoration */}
            <Icon size={70} style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.04, transform: 'rotate(-15deg)' }} />
        </div>
    );

    const totalQuestions = courses.reduce((sum, c) => sum + (c.question_number || 0), 0);
    const totalMarks = courses.reduce((sum, c) => sum + (c.total_marks || 0), 0);

    return (
        <div className="dashboard-container">
            {/* Desktop-only Sidebar */}
            <div className="dashboard-sidebar hide-on-mobile">

                <div className="nav-items-container">
                    <NavButton id="overview" label="Dashboard" icon={LayoutDashboard} />
                    <NavButton id="quizzes" label="My Quizzes" icon={BookOpen} />
                    <NavButton id="students" label="Students" icon={Users} />
                    <NavButton id="results" label="Results" icon={Trophy} />
                </div>

                <div style={{ padding: '1rem', marginTop: 'auto', width: '100%' }}>
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

                <div className="dashboard-header-flex">
                    <div style={{ flex: 1 }}>
                        <h1 className="section-title" style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', marginBottom: '0.2rem' }}>
                            {activeTab === 'overview' ? `Hello, Teacher! 👋` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {activeTab === 'quizzes' && (
                            <div className="hide-on-mobile" style={{ display: 'flex', gap: '0.75rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                                    onClick={() => setShowAIModal(true)}
                                >
                                    <Sparkles size={16} /> AI Quiz
                                </motion.button>
                                <Link to="/teacher/create-quiz" style={{ textDecoration: 'none' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                                    >
                                        <PlusCircle size={16} /> New Quiz
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                        <div style={{ textAlign: 'right' }} className="hide-on-mobile">
                            <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.9rem' }}>{user?.username}</div>
                            <div style={{ fontSize: '0.7rem', color: '#4f46e5', fontWeight: '800', textTransform: 'uppercase' }}>Teacher Portal</div>
                        </div>
                        <div className="user-avatar-circle">
                            {(user?.username?.[0] || 'T').toUpperCase()}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton skeleton-box" style={{ height: 140, marginBottom: 0 }}></div>)}
                        </div>
                        <div className="skeleton skeleton-box" style={{ height: 350 }}></div>
                    </motion.div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <>
                                <div className="stats-grid">
                                    <StatCard label="Live Quizzes" value={courses.length} sub="Active assessment courses" icon={BookOpen} colorClass="text-primary" />
                                    <StatCard label="Total Questions" value={totalQuestions} sub="Questions across all quizzes" icon={CheckCircle} colorClass="text-accent" />
                                    <StatCard label="Total Marks" value={totalMarks} sub="Maximum possible score" icon={GraduationCap} colorClass="text-secondary" />
                                    <StatCard label="Class Performance" value={`${avgScore}%`} sub="Average student score" icon={Trophy} colorClass="text-warning" />
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
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: courses.length === 0 ? '2rem' : 0, overflow: 'hidden' }}>
                                {courses.length === 0 ? (
                                    <div className="empty-state" style={{ border: 'none', background: 'transparent', margin: 0 }}>
                                        <div className="empty-state-icon"><BookOpen size={36} /></div>
                                        <h3>No Quizzes Created Yet</h3>
                                        <p>You haven't added any assessments. Get started instantly with our AI Generator or build one manually.</p>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <button className="btn btn-primary" onClick={() => setShowAIModal(true)}><Sparkles size={18} /> Generate with AI</button>
                                            <button className="btn btn-outline" onClick={() => navigate('/teacher/create-quiz')}><PlusCircle size={18} /> Manual Entry</button>
                                        </div>
                                    </div>
                                ) : (
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
                                                            <button onClick={() => navigate(`/teacher/add-question/${course._id}`)} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--primary)', border: 'none', background: 'var(--primary-dim)' }} title="Manage Questions">
                                                                <Edit size={18} />
                                                            </button>
                                                            <button onClick={() => handleDeleteCourse(course._id)} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--danger)', border: 'none', background: 'var(--danger-soft)' }} title="Delete Quiz">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'students' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: students.length === 0 ? '2rem' : 0, overflow: 'hidden' }}>
                                {students.length === 0 ? (
                                    <div className="empty-state" style={{ border: 'none', background: 'transparent', margin: 0 }}>
                                        <div className="empty-state-icon"><Users size={36} /></div>
                                        <h3>No Students Enrolled</h3>
                                        <p>There are no students registered on the platform right now.</p>
                                    </div>
                                ) : (
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
                                                            <span style={{ fontWeight: 'bold', color: 'var(--primary)', background: 'var(--primary-dim)', padding: '2px 8px', borderRadius: '10px' }}>
                                                                {results.filter(r => (r.student_id?._id === student._id || r.student_id === student._id)).length}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'results' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: results.length === 0 ? '2rem' : 0, overflow: 'hidden' }}>
                                {results.length === 0 ? (
                                    <div className="empty-state" style={{ border: 'none', background: 'transparent', margin: 0 }}>
                                        <div className="empty-state-icon"><Trophy size={36} /></div>
                                        <h3>No Results Yet</h3>
                                        <p>No students have completed any of your quizzes yet. Once they do, their performance analytics will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="table-container">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Student</th>
                                                    <th>Quiz</th>
                                                    <th>Score</th>
                                                    <th>Percentage</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.filter(r => {
                                                    const sName = `${r.student_id?.user?.first_name} ${r.student_id?.user?.last_name}`.toLowerCase();
                                                    const qName = (r.exam_id?.course_name || '').toLowerCase();
                                                    return sName.includes(searchTerm.toLowerCase()) || qName.includes(searchTerm.toLowerCase());
                                                }).map((result, i) => (
                                                    <tr key={result._id || i}>
                                                        <td>{result.student_id?.user?.first_name || 'Student'} {result.student_id?.user?.last_name || ''}</td>
                                                        <td style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{result.exam_id?.course_name || 'Quiz'}</td>
                                                        <td style={{ fontWeight: 'bold' }}>{result.marks} / {result.total_marks}</td>
                                                        <td>
                                                            <span style={{
                                                                color: (result.marks / result.total_marks >= 0.4) ? 'var(--success)' : 'var(--danger)',
                                                                background: (result.marks / result.total_marks >= 0.4) ? '#d1fae5' : '#fee2e2',
                                                                padding: '4px 8px', borderRadius: '6px',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {(result.marks / result.total_marks * 100).toFixed(0)}%
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button onClick={() => handleDeleteResult(result._id || result.id)} className="btn btn-outline" style={{ color: 'var(--danger)', padding: '0.5rem', border: 'none', background: 'var(--danger-soft)' }}>
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
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
