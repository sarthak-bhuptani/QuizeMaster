import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight, Zap, Shield,
    BarChart3, Users, Brain, Trophy,
    Sparkles, Target, GraduationCap,
    Cpu, Globe, MessageSquare,
    Medal, Award, CheckCircle, Rocket, Smile,
    Star as StarIcon, Code, Music, Gamepad2, ChevronRight, Activity
} from 'lucide-react';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const [selectedOption, setSelectedOption] = useState(null);

    const motivationCards = [
        { icon: Trophy, title: "1.2M+", label: "Success Stories", color: "#6366f1" },
        { icon: StarIcon, title: "4.9/5", label: "Top Rated App", color: "#f59e0b" },
        { icon: Users, title: "500k+", label: "Global Community", color: "#ec4899" }
    ];

    const quizPreview = {
        question: "What is the primary goal of competitive quizing?",
        options: [
            "Just for fun",
            "Knowledge Mastery",
            "To beat others",
            "Skip studying"
        ],
        correct: 1
    };

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

    const categories = [
        { icon: GraduationCap, name: 'Science', count: '3,120', color: '#14b8a6' },
        { icon: Globe, name: 'Geography', count: '1,890', color: '#f59e0b' },
        { icon: Brain, name: 'Mathematics', count: '2,780', color: '#a855f7' },
        { icon: Code, name: 'Programming', count: '4,560', color: '#64748b' },
        { icon: Music, name: 'Music', count: '980', color: '#ef4444' },
        { icon: Gamepad2, name: 'Sports', count: '1,670', color: '#22c55e' },
        { icon: Cpu, name: 'Technology', count: '3,450', color: '#3b82f6' },
        { icon: Users, name: 'Social Studies', count: '1,240', color: '#ec4899' },
    ];

    const learningFeatures = [
        {
            icon: Zap,
            title: "Lightning Fast",
            desc: "Create quizzes in minutes with our intuitive builder. No learning curve required.",
            color: "#06b6d4"
        },
        {
            icon: Users,
            title: "Multiplayer Mode",
            desc: "Challenge friends and compete in real-time with live leaderboards.",
            color: "#f97316"
        },
        {
            icon: Shield,
            title: "Proctoring Engine",
            desc: "Advanced security features to ensure fair play and academic integrity.",
            color: "#6366f1"
        },
        {
            icon: BarChart3,
            title: "Depth Analytics",
            desc: "Get detailed insights into your performance and focus on your weak points.",
            color: "#ec4899"
        }
    ];

    return (
        <div className="home-container">
            {/* Animated Background Elements */}
            <div className="desktop-bg-elements">
                <motion.div
                    style={{
                        y: y1,
                        position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                        filter: 'blur(80px)'
                    }}
                />
                <motion.div
                    style={{
                        y: y2,
                        position: 'absolute', bottom: '15%', right: '5%', width: '500px', height: '500px',
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
                        filter: 'blur(100px)'
                    }}
                />
            </div>

            <div style={{ height: '80px', position: 'relative', zIndex: 10 }}></div>

            {/* Split Hero Section */}
            <section style={{ padding: '4rem 5%', minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div className="hero-grid">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                                background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)',
                                padding: '0.6rem 1.5rem', borderRadius: '100px', color: '#818cf8',
                                fontSize: '0.9rem', fontWeight: '700', marginBottom: '2rem',
                                letterSpacing: '0.05em', textTransform: 'uppercase'
                            }}
                        >
                            <Sparkles size={18} /> THE FUTURE OF LEARNING
                        </motion.div>

                        <h1 className="hero-title">
                            Master your <br />
                            <span className="gradient-text">Future Today.</span>
                        </h1>

                        <p style={{
                            fontSize: '1.25rem',
                            color: '#94a3b8',
                            maxWidth: '650px',
                            lineHeight: 1.6,
                            marginBottom: '3.5rem',
                            fontWeight: '400'
                        }}>
                            The world's most advanced assessment engine. Created for teachers,
                            loved by students, and built for results that actually matter.
                        </p>

                        <div className="btn-group">
                            <Link to="/student/signup" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-primary"
                                    style={{
                                        padding: '1.5rem 3.5rem',
                                        fontSize: '1.2rem',
                                        borderRadius: '20px',
                                        fontWeight: '800'
                                    }}
                                >
                                    Start Journey <ArrowRight size={22} />
                                </motion.button>
                            </Link>

                            <Link to="/teacher/signup" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ background: 'rgba(255,255,255,0.08)', scale: 1.05 }}
                                    className="btn btn-outline"
                                    style={{
                                        padding: '1.5rem 2.5rem',
                                        fontSize: '1.2rem',
                                        borderRadius: '20px',
                                        fontWeight: '700'
                                    }}
                                >
                                    For Teachers
                                </motion.button>
                            </Link>
                        </div>

                        {/* Motivation Stats */}
                        <div className="motivation-stats">
                            {motivationCards.map((card, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: `${card.color}20`, padding: '10px', borderRadius: '12px' }}>
                                        <card.icon size={24} color={card.color} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{card.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{card.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Content: Interactive Quiz/Achievement Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        style={{ position: 'relative' }}
                    >
                        <div className="glass" style={{
                            padding: '3rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.08)',
                            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.4))',
                            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)',
                            position: 'relative', zIndex: 1
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }}></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Challenge</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Question 1/1</div>
                            </div>

                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2.5rem', lineHeight: 1.3 }}>
                                {quizPreview.question}
                            </h3>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {quizPreview.options.map((opt, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ x: 10, background: 'rgba(255,255,255,0.05)' }}
                                        onClick={() => setSelectedOption(i)}
                                        style={{
                                            padding: '1.2rem 1.5rem', borderRadius: '18px', textAlign: 'left',
                                            background: selectedOption === i
                                                ? (i === quizPreview.correct ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)')
                                                : 'rgba(255,255,255,0.02)',
                                            border: selectedOption === i
                                                ? (i === quizPreview.correct ? '1px solid #4ade80' : '1px solid #f87171')
                                                : '1px solid rgba(255,255,255,0.05)',
                                            color: selectedOption === i
                                                ? (i === quizPreview.correct ? '#4ade80' : '#f87171')
                                                : '#cbd5e1',
                                            cursor: 'pointer', fontSize: '1.05rem', fontWeight: '600',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            transition: '0.3s'
                                        }}
                                    >
                                        {opt}
                                        {selectedOption === i && (
                                            i === quizPreview.correct ? <CheckCircle size={20} /> : <Smile size={20} />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            {selectedOption !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ marginTop: '2.5rem', textAlign: 'center' }}
                                >
                                    <div style={{ fontSize: '1rem', color: selectedOption === quizPreview.correct ? '#4ade80' : '#f87171', fontWeight: '700', marginBottom: '1.5rem' }}>
                                        {selectedOption === quizPreview.correct
                                            ? "Correct! You're ready for the real thing."
                                            : "Not quite! Learning is a journey."}
                                    </div>
                                    <Link to="/student/signup">
                                        <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px' }}>
                                            Unlock Full Quiz <Rocket size={18} />
                                        </button>
                                    </Link>
                                </motion.div>
                            )}

                            {/* Floating Achievement Badge */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    position: 'absolute', top: '-2rem', right: '-2rem',
                                    padding: '1rem', background: '#ec4899', color: '#fff',
                                    borderRadius: '20px', boxShadow: '0 20px 40px rgba(236,72,153,0.3)',
                                    display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10
                                }}
                            >
                                <Trophy size={20} />
                                <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>New High Score!</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* High-Tech Editorial Features Section: Everything You Need to Learn Better */}
            <section style={{ padding: '12rem 5%', backgroundColor: '#020617', position: 'relative', overflow: 'hidden' }}>
                {/* Background Blueprint Grid */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px', opacity: 0.5, pointerEvents: 'none'
                }}></div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'left', marginBottom: '8rem' }}>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            style={{ color: '#06b6d4', fontWeight: '800', fontSize: '1rem', letterSpacing: '4px', textTransform: 'uppercase' }}
                        >
                            Capabilities
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: '950', color: '#fff', marginTop: '1.5rem', lineHeight: 1, letterSpacing: '-0.05em' }}
                        >
                            Everything You Need to <br />
                            <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>Learn Better</span>
                        </motion.h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15rem' }}>
                        {/* Feature 1: The Engine */}
                        <div className="feature-grid">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div style={{ fontSize: '1.2rem', color: '#06b6d4', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '1px', background: '#06b6d4' }}></div> 01. SPEED
                                </div>
                                <h3 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', marginBottom: '2rem', lineHeight: 1.1 }}>Lightning Fast <br /> Assessment Engine</h3>
                                <p style={{ color: '#94a3b8', fontSize: '1.3rem', lineHeight: 1.7, marginBottom: '3rem' }}>
                                    Our proprietary engine processes millions of data points in milliseconds. Create, deploy, and grade assessments with surgical precision.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.5rem' }}>
                                    {['AI-Powered Question Generation', 'Instant Feedback Loops', 'Zero-Latency Hosting'].map((item, idx) => (
                                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff', fontWeight: '600', fontSize: '1.1rem' }}>
                                            <div style={{ padding: '5px', borderRadius: '50%', background: '#06b6d420' }}>
                                                <CheckCircle size={18} color="#06b6d4" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                style={{ position: 'relative' }}
                            >
                                <div className="feature-image-container">
                                    <img
                                        src="/assessment_engine.png"
                                        alt="Assessment Engine"
                                        className="feature-image"
                                    />
                                    <div className="feature-image-glow" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Feature 2: Analytics */}
                        <div className="feature-grid">
                            <motion.div
                                initial={{ opacity: 0, order: 2, scale: 0.9, rotate: -5 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                style={{ position: 'relative' }}
                            >
                                <div className="feature-image-container">
                                    <img
                                        src="/analytics_dashboard.png"
                                        alt="Analytics Dashboard"
                                        className="feature-image"
                                    />
                                    <div className="feature-image-glow pink" />
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div style={{ fontSize: '1.2rem', color: '#ec4899', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '1px', background: '#ec4899' }}></div> 02. INSIGHTS
                                </div>
                                <h3 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', marginBottom: '2rem', lineHeight: 1.1 }}>Decision-Grade <br /> Learning Analytics</h3>
                                <p style={{ color: '#94a3b8', fontSize: '1.3rem', lineHeight: 1.7, marginBottom: '3rem' }}>
                                    Go beyond simple scores. Our analytics suite provides behavioral insights, predicting student performance and identifying knowledge gaps before they widen.
                                </p>
                                <button className="btn btn-outline" style={{ border: '1px solid #ec4899', color: '#ec4899', padding: '1rem 2.5rem', borderRadius: '15px' }}>
                                    Explore Analytics
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore Popular Topics Section */}
            <section style={{ padding: '8rem 5%', backgroundColor: 'rgba(15, 23, 42, 0.4)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div style={{ color: '#06b6d4', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                            CATEGORIES
                        </div>
                        <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '900', color: '#fff', marginBottom: '1.5rem' }}>
                            Explore <span style={{ color: '#f43f5e' }}>Popular Topics</span>
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 5rem', lineHeight: 1.6 }}>
                            From science to art, find quizzes in any subject you want to master.
                        </p>
                    </motion.div>

                    <div className="categories-grid">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }}
                                style={{
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '24px', padding: '1rem', cursor: 'pointer', /* Reduce padding for mobile */
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
                                }}
                            >
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '18px', /* Reduce size for mobile */
                                    background: `${cat.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: `0 10px 30px ${cat.color}30`
                                }}>
                                    <cat.icon size={24} color="#fff" />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', marginBottom: '0.25rem' }}>{cat.name}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>{cat.count}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hall of Fame Leaderboard */}
            <section style={{ padding: '8rem 5%', background: '#020617', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ color: '#f59e0b', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                        RANKINGS
                    </div>
                    <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '900', color: '#fff', marginBottom: '4rem' }}>
                        Hall of <span style={{ color: '#f59e0b' }}>Fame</span>
                    </h2>

                    <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
                        {/* Mock Leaderboard Data - Ideally fetched from API */}
                        {[
                            { name: "Alex Johnson", score: "12,450 XP", badge: "Quantum Overlord", color: "#eab308" },
                            { name: "Sarah Williams", score: "11,200 XP", badge: "Obsidian Scholar", color: "#94a3b8" },
                            { name: "Michael Chen", score: "10,890 XP", badge: "Speedster", color: "#b45309" }
                        ].map((student, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="leaderboard-card"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: student.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '800', color: '#000'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff' }}>{student.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{student.badge}</div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#f59e0b' }}>
                                    {student.score}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >



            {/* Immersive Depth CTA: The Future of Learning */}
            {/* Recreated CTA Section: Dark Mode Theme */}
            <section style={{
                padding: '12rem 5%',
                background: '#020617',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
                textAlign: 'center'
            }}>
                {/* Background Grid Accent */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px)',
                    backgroundSize: '30px 30px', opacity: 0.4, pointerEvents: 'none'
                }}></div>

                <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    {/* Top Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'rgba(6, 182, 212, 0.1)',
                            padding: '12px 28px',
                            borderRadius: '100px',
                            border: '1px solid rgba(6, 182, 212, 0.2)',
                            marginBottom: '4rem',
                            color: '#06b6d4',
                            fontWeight: '700',
                            letterSpacing: '1px',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        <Sparkles size={18} /> Join 2M+ Learners Today
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            fontWeight: '900',
                            color: '#fff',
                            lineHeight: 1.1,
                            letterSpacing: '-0.03em',
                            marginBottom: '2.5rem'
                        }}
                    >
                        Ready to <span className="gradient-text">Transform</span> <br />
                        How You Learn?
                    </motion.h2>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
                            color: '#94a3b8',
                            marginBottom: '4rem',
                            maxWidth: '650px',
                            marginInline: 'auto',
                            lineHeight: 1.7,
                            fontWeight: '500'
                        }}
                    >
                        Start creating engaging quizzes for free. <br />
                        <span style={{ color: '#fff' }}>No credit card required.</span>
                    </motion.p>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/student/signup" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2, boxShadow: '0 15px 30px rgba(6, 182, 212, 0.2)' }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    padding: '1.4rem 3.5rem',
                                    background: '#06b6d4',
                                    color: '#020617',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontSize: '1.1rem',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                Get Started Free <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.05)' }}
                            style={{
                                padding: '1.4rem 3.5rem',
                                background: 'transparent',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '16px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                transition: '0.3s'
                            }}
                        >
                            Watch Demo
                        </motion.button>
                    </div>
                </div>

                {/* Decorative Atmosphere */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '100vw', height: '100vw',
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
                    zIndex: 0, pointerEvents: 'none'
                }}></div>
            </section>

            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                
                body { margin: 0; background: #020617; color: #f8fafc; }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }

                * { box-sizing: border-box; }
            `}</style>
        </div >
    );
};

export default Home;
