import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Star, Shield, Zap, Layout, Users, Trophy } from 'lucide-react';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        const admin = localStorage.getItem('admin');
        if (user) {
            const parsed = JSON.parse(user);
            if (parsed.teacherId) navigate('/teacher-dashboard');
            else if (parsed.studentId) navigate('/student-dashboard');
        } else if (admin) {
            navigate('/admin-dashboard');
        }
    }, [navigate]);

    return (
        <div className="home-wrapper">
            {/* Header Spacer */}
            <div style={{ height: '70px' }}></div>

            {/* Hero Section - Centered & Simple */}
            <section className="ultra-hero">
                <div className="container">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-content-center"
                    >
                        <div className="badge-new">✨ Simple. Powerful. Free.</div>
                        <h1 className="main-heading">
                            The smartest way to <br />
                            <span>test and learn.</span>
                        </h1>
                        <p className="sub-heading">
                            Create professional quizzes in minutes. Join thousands of teachers and students using QuizMaster to simplify their education journey.
                        </p>
                        
                        <div className="hero-actions">
                            <Link to="/student/signup" className="primary-btn-large">
                                Get Started Free <ArrowRight size={20} />
                            </Link>
                            <Link to="/student/login" className="secondary-btn-large">
                                View Demo
                            </Link>
                        </div>

                        <div className="hero-trust">
                            <div className="stars">
                                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                            </div>
                            <span>Trusted by 5,000+ educators worldwide</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Feature Icons - Horizontal & Minimal */}
            <section className="features-simple">
                <div className="container">
                    <div className="feature-grid-simple">
                        <div className="feature-item-simple">
                            <div className="icon-box purple"><Layout size={24} /></div>
                            <h3>Intuitive Builder</h3>
                            <p>Create quizzes with 0 learning curve. It's as easy as typing a document.</p>
                        </div>
                        <div className="feature-item-simple">
                            <div className="icon-box green"><Zap size={24} /></div>
                            <h3>Real-time Results</h3>
                            <p>Instantly see who's passing and who's struggling with rich analytics.</p>
                        </div>
                        <div className="feature-item-simple">
                            <div className="icon-box blue"><Users size={24} /></div>
                            <h3>Class Management</h3>
                            <p>Organize students, track attendance, and manage multiple cohorts easily.</p>
                        </div>
                        <div className="feature-item-simple">
                            <div className="icon-box yellow"><Trophy size={24} /></div>
                            <h3>Gamified Experience</h3>
                            <p>Badges, leaderboards, and rewards to keep students engaged and motivated.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role Cards - Clear Path for Users */}
            <section className="role-sections">
                <div className="container">
                    <div className="role-grid">
                        <motion.div whileHover={{ y: -10 }} className="role-card student-v">
                            <h2>For Students</h2>
                            <p>Take exams from anywhere, track your scores, and reach the top of the leaderboard.</p>
                            <ul>
                                <li><CheckCircle2 size={18} /> Interactive Quiz Interface</li>
                                <li><CheckCircle2 size={18} /> Personal Performance Dashboard</li>
                                <li><CheckCircle2 size={18} /> Instant Result Feedback</li>
                            </ul>
                            <Link to="/student/login" className="role-btn">Student Login</Link>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="role-card teacher-v">
                            <h2>For Teachers</h2>
                            <p>A complete toolkit to manage assessments, grade questions, and monitor progress.</p>
                            <ul>
                                <li><CheckCircle2 size={18} /> Automated Grading System</li>
                                <li><CheckCircle2 size={18} /> Detailed Student Analytics</li>
                                <li><CheckCircle2 size={18} /> Easy Exam Creation</li>
                            </ul>
                            <Link to="/teacher/login" className="role-btn">Teacher Login</Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
