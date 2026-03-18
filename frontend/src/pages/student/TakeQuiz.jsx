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
            <div style={{ 
                padding: '2rem 1rem', 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: '#f8fafc',
                position: 'fixed',
                inset: 0,
                zIndex: 9999
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                        padding: window.innerWidth < 768 ? '2rem' : '3.5rem', 
                        maxWidth: '550px', 
                        width: '100%', 
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0',
                        color: '#1e293b'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ 
                            width: '70px', 
                            height: '70px', 
                            background: '#f1f5f9', 
                            borderRadius: '50%', 
                            margin: '0 auto 1.5rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center'
                        }}>
                            <Shield size={32} color="#6366f1" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Quiz Instructions</h2>
                        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Please read carefully before starting.</p>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem', border: '1px solid #e2e8f0' }}>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#475569', fontSize: '0.95rem', lineHeight: '1.8' }}>
                            <li>The quiz will open in <strong>Fullscreen Mode</strong>.</li>
                            <li>Do not minimize or switch tabs during the quiz.</li>
                            <li>Each question has a specific time limit.</li>
                            <li>The quiz will auto-submit once the time ends.</li>
                        </ul>
                    </div>

                    <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        cursor: 'pointer', 
                        marginBottom: '2rem', 
                        padding: '1rem', 
                        background: agreed ? '#eff6ff' : '#ffffff', 
                        borderRadius: '12px',
                        border: agreed ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                        transition: 'all 0.2s'
                    }}>
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.95rem', color: agreed ? '#1e40af' : '#64748b', fontWeight: 500 }}>I am ready to follow the instructions.</span>
                    </label>

                    <button
                        onClick={enterFullscreen}
                        disabled={!agreed}
                        className="btn btn-primary"
                        style={{ 
                            width: '100%', 
                            padding: '1.1rem', 
                            fontSize: '1.1rem', 
                            fontWeight: 700, 
                            borderRadius: '14px',
                            opacity: agreed ? 1 : 0.5,
                            cursor: agreed ? 'pointer' : 'not-allowed',
                            boxShadow: agreed ? '0 10px 15px -3px rgba(99, 102, 241, 0.2)' : 'none'
                        }}
                    >
                        Start Quiz Now
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
            const selectedKey = selectedAnswers[index];
            const selectedText = selectedKey ? q[selectedKey.toLowerCase()] : null; 

            // Handle both new format ('Option1') and legacy AI format ('Paris')
            const isCorrect = (selectedKey && q.answer === selectedKey) || (selectedText && q.answer === selectedText);
            
            const qMarks = Number(q.marks) || 0;
            if (isCorrect) totalScore += qMarks;
            totalPossible += qMarks;

            return {
                question_id: q._id,
                selected_option: selectedKey || null,
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
                body: questions.map((q, i) => {
                    const selectedKey = selectedAnswers[i];
                    const selectedText = selectedKey ? q[selectedKey.toLowerCase()] : null;
                    const isCorrect = (selectedKey && q.answer === selectedKey) || (selectedText && q.answer === selectedText);
                    return [
                        i + 1,
                        q.question,
                        selectedKey || 'None',
                        q.answer,
                        isCorrect ? 'CORRECT' : 'WRONG'
                    ];
                }),
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
        const totalPossible = questions.reduce((s, q) => s + (Number(q.marks) || 0), 0);
        const percentage = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
        
        let greetMessage = "Good Effort!";
        if (percentage >= 90) greetMessage = "Outstanding Achievement! 🏆";
        else if (percentage >= 75) greetMessage = "Great Job! 🌟";
        else if (percentage >= 50) greetMessage = "Well Done! 👍";

        return (
            <div style={{ 
                minHeight: '100vh', 
                background: '#f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '1rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                    style={{ 
                        maxWidth: '450px', 
                        width: '100%', 
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'white', 
                        borderRadius: '20px', 
                        padding: '0',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        textAlign: 'center',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    {/* Decorative Top Background */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '100px',
                        background: percentage >= 50 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        zIndex: 0
                    }}></div>

                    {/* Content Container (Scrollable) */}
                    <div style={{ position: 'relative', zIndex: 1, padding: '1.25rem 1.5rem 1.25rem', overflowY: 'auto' }} className="custom-scrollbar">
                        
                        {/* Icon */}
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            style={{ 
                                width: '60px', 
                                height: '60px', 
                                background: 'white', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                margin: '20px auto 0.75rem',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                border: '3px solid white'
                            }}
                        >
                            <CheckCircle size={30} color={percentage >= 50 ? "#10b981" : "#6366f1"} />
                        </motion.div>
                        
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                            Thank You!
                        </h2>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: percentage >= 50 ? '#059669' : '#4f46e5', marginBottom: '0.4rem' }}>
                            {greetMessage}
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.4', padding: '0 0.5rem' }}>
                            Your exams answers have been recorded.
                        </p>

                        <div style={{ 
                            background: '#f8fafc', 
                            padding: '1rem', 
                            borderRadius: '16px', 
                            marginBottom: '1.25rem',
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Inner decorative blob */}
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(99, 102, 241, 0.04)', borderRadius: '50%' }}></div>
                            
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Final Score</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: '1', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.3rem' }}>
                                {score} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700 }}>/ {totalPossible}</span>
                            </div>
                            
                            <div style={{ 
                                marginTop: '0.75rem', 
                                display: 'inline-block', 
                                padding: '0.2rem 0.8rem', 
                                background: percentage >= 50 ? '#dcfce7' : '#e0e7ff', 
                                color: percentage >= 50 ? '#166534' : '#3730a3', 
                                borderRadius: '100px', 
                                fontSize: '0.75rem', 
                                fontWeight: 800 
                            }}>
                                {percentage}% Accuracy
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {resultId && (
                                <button 
                                    onClick={() => navigate(`/student/analysis/${resultId}`)} 
                                    className="btn btn-primary" 
                                    style={{ padding: '0.75rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)' }}
                                >
                                    Detailed Analysis
                                </button>
                            )}
                            <button 
                                onClick={() => navigate('/student-dashboard')} 
                                className="btn" 
                                style={{ padding: '0.75rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
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
        <div style={{ 
            minHeight: '100vh', 
            background: '#f8fafc', 
            padding: window.innerWidth < 768 ? '1rem 0.5rem' : '2rem 1rem',
            color: '#1e293b'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                
                {/* Top Info Bar */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: window.innerWidth < 480 ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: window.innerWidth < 480 ? 'flex-start' : 'center', 
                    marginBottom: '1.5rem',
                    background: 'white',
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>
                            Question {currentQuestion + 1} 
                            <span style={{ color: '#64748b', fontWeight: 500, marginLeft: '0.4rem' }}>of {questions.length}</span>
                        </div>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        background: timeLeft < 60 ? '#fef2f2' : '#f1f5f9', 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '10px', 
                        border: timeLeft < 60 ? '1px solid #fee2e2' : '1px solid #e2e8f0',
                        width: window.innerWidth < 480 ? '100%' : 'auto',
                        justifyContent: window.innerWidth < 480 ? 'center' : 'flex-start'
                    }}>
                        <Clock size={16} color={timeLeft < 60 ? '#ef4444' : '#64748b'} />
                        <span style={{ fontSize: '1rem', fontWeight: '800', color: timeLeft < 60 ? '#ef4444' : '#1e293b' }}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1fr 200px', gap: '1.5rem' }}>
                    {/* Question Card */}
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ 
                            padding: window.innerWidth < 768 ? '1.5rem' : '2.5rem', 
                            borderRadius: '24px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
                        }}
                    >
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '2rem', lineHeight: '1.6' }}>
                            {question.question}
                        </h3>

                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {options.map((opt, idx) => {
                                const isSelected = selectedAnswers[currentQuestion] === opt.key;
                                return (
                                    <div
                                        key={opt.key}
                                        onClick={() => handleOptionSelect(opt.key)}
                                        style={{
                                            padding: '1.1rem 1.5rem',
                                            borderRadius: '12px',
                                            background: isSelected ? '#eff6ff' : 'white',
                                            border: `2px solid ${isSelected ? '#3b82f6' : '#e2e8f0'}`,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{
                                            width: '22px',
                                            height: '22px',
                                            borderRadius: '50%',
                                            border: `2px solid ${isSelected ? '#3b82f6' : '#cbd5e1'}`,
                                            background: isSelected ? '#3b82f6' : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }}></div>}
                                        </div>
                                        <span style={{ fontSize: '1.05rem', color: '#334155' }}>{opt.text}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            flexDirection: window.innerWidth < 400 ? 'column' : 'row',
                            justifyContent: 'space-between', 
                            marginTop: '2.5rem',
                            gap: '1rem'
                        }}>
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                style={{ 
                                    padding: '0.75rem 1.5rem', 
                                    background: 'white', 
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '10px', 
                                    fontWeight: 600, 
                                    cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                                    opacity: currentQuestion === 0 ? 0.5 : 1,
                                    width: window.innerWidth < 400 ? '100%' : 'auto'
                                }}
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                className="btn btn-primary"
                                style={{ 
                                    padding: '0.75rem 2rem', 
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    width: window.innerWidth < 400 ? '100%' : 'auto'
                                }}
                            >
                                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                            </button>
                        </div>
                    </motion.div>

                    {/* Simple Right Sidebar Navigation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ 
                            padding: '1.25rem', 
                            background: 'white', 
                            borderRadius: '20px', 
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase' }}>Jump to:</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                {questions.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQuestion(idx)}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid',
                                            background: currentQuestion === idx ? '#3b82f6' : !!selectedAnswers[idx] ? '#dbeafe' : '#f1f5f9',
                                            borderColor: currentQuestion === idx ? '#3b82f6' : !!selectedAnswers[idx] ? '#bfdbfe' : '#e2e8f0',
                                            color: currentQuestion === idx ? 'white' : !!selectedAnswers[idx] ? '#1e40af' : '#64748b'
                                        }}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeQuiz;
