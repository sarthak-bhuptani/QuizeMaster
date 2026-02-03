import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight, Clock, AlertCircle, Shield, Activity, Lock, Zap, Target, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TakeQuiz = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // State
    const [questions, setQuestions] = useState([]);
    const [quizDetails, setQuizDetails] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [resultId, setResultId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [timerActive, setTimerActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchQuizData();
    }, []);

    // Timer Logic
    useEffect(() => {
        let timer;
        if (timerActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            submitQuiz(); // Auto submit on timeout
        }
        return () => clearInterval(timer);
    }, [timerActive, timeLeft]);

    // Anti-Cheating & Security Logic
    const [fullscreen, setFullscreen] = useState(false);
    const [warnings, setWarnings] = useState(0);
    const [agreed, setAgreed] = useState(false);

    const enterFullscreen = () => {
        if (!agreed) {
            alert("Please acknowledge the security guidelines first.");
            return;
        }
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen().then(() => setFullscreen(true)).catch(err => console.log(err));
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen().then(() => setFullscreen(true));
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen().then(() => setFullscreen(true));
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen().then(() => setFullscreen(true));
        }
    };

    useEffect(() => {
        // 1. Prevent Right Click
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        // 2. Keyboard Lockdown (Disable F12, Ctrl+C, Ctrl+V, Alt+Tab, etc.)
        const handleKeyDown = (e) => {
            // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                (e.ctrlKey && e.keyCode === 85) ||
                (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86)) // Disable Copy/Paste
            ) {
                e.preventDefault();
                return false;
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // 3. Tab Switch / Minimizing Detection
        const handleVisibilityChange = () => {
            if (document.hidden && score === null && fullscreen) {
                setWarnings(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) {
                        alert("TERMINAL VIOLATION: Secure environment breached. Auto-submitting exam now.");
                        submitQuiz();
                    } else {
                        alert(`SECURITY ALERT: External navigation detected! Strike ${newCount}/3.\n\nWarning: The next violation will result in immediate disqualification and auto-submission.`);
                    }
                    return newCount;
                });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [score, fullscreen]); // Dependency on score/fullscreen

    if (!fullscreen && !loading && score === null) {
        return (
            <div style={{ padding: '4rem 2rem', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)', overflowY: 'auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ padding: '3.5rem', maxWidth: '650px', width: '100%', border: '1px solid rgba(99, 102, 241, 0.3)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', margin: '2rem 0' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '24px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <Shield size={40} color="#818cf8" />
                        </div>
                        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.8rem', letterSpacing: '-0.5px' }}>Proctoring System</h2>
                        <div style={{ height: '4px', width: '60px', background: '#6366f1', margin: '0 auto 1.5rem', borderRadius: '2px' }}></div>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Initial system integrity check required before access.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {[
                            { label: 'AI Tab Monitoring', status: 'Active', icon: Activity },
                            { label: 'Keyboard Lockdown', status: 'Engaged', icon: Lock },
                            { label: 'Clipboard Guard', status: 'Secured', icon: Zap },
                            { label: 'Network Integrity', status: 'Linked', icon: Target }
                        ].map((rule, i) => (
                            <div key={i} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <rule.icon size={20} color="#818cf8" />
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{rule.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>● {rule.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)', marginBottom: '2.5rem' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#f87171', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Violation Policy</h4>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            <li>Minimizing windows or switching tabs will trigger a strike.</li>
                            <li>Print-screen, DevTools, and Copy/Paste are disabled.</li>
                            <li>Three strikes will result in <strong>automatic exam submission</strong>.</li>
                        </ul>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            style={{ width: '20px', height: '20px', accentColor: '#6366f1' }}
                        />
                        <span style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>I acknowledge and agree to follow all proctoring guidelines.</span>
                    </label>

                    <button
                        onClick={enterFullscreen}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 700, borderRadius: '16px', opacity: agreed ? 1 : 0.5, cursor: agreed ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}
                    >
                        Initialize Security Mode & Start
                    </button>
                </motion.div>
            </div>
        );
    }

    const fetchQuizData = async () => {
        try {
            // Fetch questions
            const qRes = await api.get(`/exam/questions/${courseId}`);
            setQuestions(qRes.data);

            // Fetch course details (for time limit)
            const allCourses = await api.get('/exam/courses');
            const thisCourse = allCourses.data.find(c => c._id === courseId);

            if (thisCourse) {
                setQuizDetails(thisCourse);
                setTimeLeft((thisCourse.time_limit || 30) * 60);
                setTimerActive(true);
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleOptionSelect = (optionKey) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: optionKey
        });
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            submitQuiz();
        }
    };

    // ... (keeping submitQuiz and others as is, only replacing up to the return where buttons are)

    // We can't easily replace just the function and the JSX lower down in one go if they are far apart.
    // However, looking at the file, handleNext is around line 213, and the JSX is around 419.
    // I should probably do two edits or one big one if I verify the content strictly.
    // Safe bet: Add the function first, then the JSX.


    const submitQuiz = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setTimerActive(false);
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.log(err));
        }

        let totalScore = 0;
        let totalPossible = 0;
        const detailedAnswers = questions.map((q, index) => {
            const isCorrect = selectedAnswers[index] === q.answer;
            if (isCorrect) totalScore += q.marks;
            totalPossible += q.marks;

            return {
                question_id: q._id,
                selected_option: selectedAnswers[index] || null,
                is_correct: isCorrect
            };
        });

        setScore(totalScore);

        if (user && (user.studentId || user._id)) {
            try {
                const res = await api.post('/exam/results', {
                    student_id: user.studentId || user._id, // Handle both ID formats
                    exam_id: courseId,
                    marks: totalScore,
                    total_marks: totalPossible,
                    answers: detailedAnswers
                });
                setResultId(res.data._id);
                setIsSubmitting(false); // Stop loading spinner
            } catch (error) {
                console.error('Failed to save result:', error);
                setIsSubmitting(false);
            }
        } else {
            setIsSubmitting(false);
        }
    };
    const downloadResultPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(99, 102, 241);
            doc.text("Quiz Assessment Report", 105, 30, null, null, "center");

            doc.setFontSize(16);
            doc.setTextColor(100);
            const studentName = user?.name || 'Student';
            doc.text(`Student: ${studentName}`, 105, 50, null, null, "center");
            doc.text(`Exam: ${quizDetails?.course_name || 'Quiz'}`, 105, 60, null, null, "center");
            doc.text(`Score: ${score} / ${questions.reduce((s, q) => s + q.marks, 0)}`, 105, 70, null, null, "center");

            autoTable(doc, {
                startY: 90,
                head: [['#', 'Question', 'Selected', 'Correct', 'Status']],
                body: questions.map((q, i) => [
                    i + 1,
                    q.question,
                    selectedAnswers[i] || 'None',
                    q.answer,
                    selectedAnswers[i] === q.answer ? 'CORRECT' : 'WRONG'
                ]),
                theme: 'striped',
                headStyles: { fillColor: [99, 102, 241] }
            });

            doc.save(`${quizDetails?.course_name || 'Result'}_Analysis.pdf`);
        } catch (error) {
            console.error("PDF Error:", error);
            alert("Could not generate PDF");
        }
    };

    if (loading) return <div style={{ padding: '8rem', textAlign: 'center', color: 'white' }}>Loading Quiz Details...</div>;
    if (isSubmitting) return (
        <div style={{ padding: '8rem', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
            <h3>Submitting your exam...</h3>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
    if (questions.length === 0) return <div style={{ padding: '8rem', textAlign: 'center', color: 'white' }}>No questions found for this quiz.</div>;

    // Result Screen
    if (score !== null) {
        return (
            <div className="page-container" style={{ textAlign: 'center' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card"
                    style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}
                >
                    <div style={{ width: '80px', height: '80px', background: 'rgba(52, 211, 153, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={40} color="#34d399" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Quiz Completed!</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Score: {score}</p>

                    {resultId ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button onClick={() => navigate(`/student/analysis/${resultId}`)} className="btn btn-primary" style={{ width: '100%' }}>
                                View Detailed Analysis
                            </button>
                            <button onClick={downloadResultPDF} className="btn btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                                <Download size={18} /> Download PDF Report
                            </button>
                        </div>
                    ) : (
                        <div style={{ padding: '0.8rem', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            Result saved locally. Syncing with server...
                        </div>
                    )}

                    <button onClick={() => navigate('/student-dashboard')} className="btn btn-outline" style={{ width: '100%' }}>
                        Back to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const options = [
        { key: 'Option1', text: question.option1 },
        { key: 'Option2', text: question.option2 },
        { key: 'Option3', text: question.option3 },
        { key: 'Option4', text: question.option4 },
    ];

    return (
        <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>

            {/* Header: Timer & Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Question {currentQuestion + 1} of {questions.length}</span>
                    <div style={{ width: '150px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '0.5rem' }}>
                        <div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px', transition: 'width 0.3s' }}></div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: timeLeft < 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.1)', padding: '0.6rem 1rem', borderRadius: '30px', border: timeLeft < 60 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent' }}>
                    <Clock size={18} color={timeLeft < 60 ? '#f87171' : '#818cf8'} />
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', fontVariantNumeric: 'tabular-nums', color: timeLeft < 60 ? '#f87171' : 'white' }}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <motion.div
                key={currentQuestion}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="glass-card"
                style={{ padding: '3rem', position: 'relative' }}
            >
                <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', color: '#94a3b8' }}>
                    {question.marks} Marks
                </div>

                <h3 style={{ fontSize: '1.5rem', marginBottom: '2.5rem', lineHeight: '1.6', maxWidth: '90%' }}>{question.question}</h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {options.map((opt) => (
                        <div
                            key={opt.key}
                            onClick={() => handleOptionSelect(opt.key)}
                            style={{
                                padding: '1.2rem 1.5rem',
                                borderRadius: '16px',
                                background: selectedAnswers[currentQuestion] === opt.key ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)',
                                border: selectedAnswers[currentQuestion] === opt.key ? '1px solid var(--primary)' : '1px solid transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                transition: 'all 0.2s',
                                fontSize: '1.1rem'
                            }}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                border: selectedAnswers[currentQuestion] === opt.key ? '6px solid var(--primary)' : '2px solid #64748b',
                                background: 'transparent'
                            }}></div>
                            <span>{opt.text}</span>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0 || isSubmitting}
                        className="btn btn-outline"
                        style={{
                            padding: '0.8rem 2rem',
                            fontSize: '1.1rem',
                            opacity: (currentQuestion === 0 || isSubmitting) ? 0.5 : 1,
                            cursor: (currentQuestion === 0 || isSubmitting) ? 'not-allowed' : 'pointer',
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.2)'
                        }}
                    >
                        Previous
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                    >
                        {isSubmitting ? (
                            <>Please Wait...</>
                        ) : (
                            currentQuestion === questions.length - 1 ? 'Finish Exam' : 'Next Question'
                        )}
                        {!isSubmitting && <ArrowRight size={20} />}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default TakeQuiz;
