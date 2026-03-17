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
            <div className="home-unified-bg">
                <div className="shape circle-1"></div>
                <div className="shape circle-2"></div>
                <div className="shape circle-3"></div>
            </div>

            {/* Premium Hero Section */}
            <section className="hero-premium">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="hero-content"
                    >
                        <span className="hero-badge">Explore the future of education</span>
                        <h1 className="hero-title">
                            Master your skills with <br />
                            <span className="gradient-text">QuizMaster AI</span>
                        </h1>
                        <p className="hero-subtitle">
                            The all-in-one platform for rapid quiz creation, real-time assessment, and gamified learning experiences.
                        </p>

                        <div className="hero-cta-group">
                            <Link to="/student/signup" className="btn-primary-v5">
                                Join Now — It's Free <ArrowRight size={20} />
                            </Link>
                            <Link to="/student/login" className="btn-secondary-v5">
                                Explore Featured Quizzes
                            </Link>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <strong>50k+</strong>
                                <span>Active Users</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <strong>100k+</strong>
                                <span>Quizzes Taken</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <strong>4.9/5</strong>
                                <span>User Rating</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2>How it Works</h2>
                        <p>Get started with QuizMaster in three simple steps</p>
                    </div>

                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-num">01</div>
                            <div className="step-icon blue"><Layout size={24} /></div>
                            <h3>Create / Choose</h3>
                            <p>Teachers can build quizzes manually or using AI, while students pick from categories.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-num">02</div>
                            <div className="step-icon purple"><Zap size={24} /></div>
                            <h3>Engage & Solve</h3>
                            <p>Take interactive quizzes with real-time feedback and earn XP on every right answer.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-num">03</div>
                            <div className="step-icon green"><Trophy size={24} /></div>
                            <h3>Track Progress</h3>
                            <p>Analyze results with deep insights, unlock badges, and climb the global leaderboard.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Access Section */}
            <section className="portal-access">
                <div className="container">
                    <div className="portal-grid">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="portal-card student-portal"
                        >
                            <div className="portal-label">FOR STUDENTS</div>
                            <h3>Start Your Learning Journey</h3>
                            <p>Test your knowledge, compete with peers, and track your academic growth with interactive tools.</p>
                            <ul className="portal-features">
                                <li><CheckCircle2 size={16} /> Instant Grading & Feedback</li>
                                <li><CheckCircle2 size={16} /> Achievement Badges/XP</li>
                                <li><CheckCircle2 size={16} /> Detailed Performance Reports</li>
                            </ul>
                            <Link to="/student/login" className="portal-btn">Access Student Panel</Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="portal-card teacher-portal"
                        >
                            <div className="portal-label">FOR TEACHERS & ADMINS</div>
                            <h3>Empower Your Classroom</h3>
                            <p>Create impactful assessments, manage student groups, and gain powerful insights into class performance.</p>
                            <ul className="portal-features">
                                <li><CheckCircle2 size={16} /> AI-Powered Quiz Generator</li>
                                <li><CheckCircle2 size={16} /> Manual Question Editor</li>
                                <li><CheckCircle2 size={16} /> Class-wide Analytics</li>
                            </ul>
                            <Link to="/teacher/login" className="portal-btn">Access Professional Panel</Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
