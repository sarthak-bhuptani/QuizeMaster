import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, GraduationCap, Sparkles, Clock } from 'lucide-react';

const CreateQuiz = () => {
    const [formData, setFormData] = useState({
        course_name: '',
        time_limit: '30'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/exam/courses', {
                ...formData,
                question_number: 0,
                total_marks: 0
            });
            alert('Quiz Created Successfully!');
            navigate('/teacher-dashboard');
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert('Failed to create quiz');
        }
    };

    return (
        <div style={{ padding: '8rem 2rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '90vh' }}>
            <motion.button
                whileHover={{ x: -5 }}
                onClick={() => navigate(-1)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem' }}
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ padding: '4rem', position: 'relative', overflow: 'hidden' }}
            >
                {/* Decor elements */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.2 }}></div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    Create Assessment
                </h1>
                <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>Set up the details for your new examination.</p>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.8rem', color: '#cbd5e1', fontWeight: '500' }}>Quiz Title</label>
                            <input
                                type="text"
                                name="course_name"
                                placeholder="e.g. Advanced Data Structures Final"
                                value={formData.course_name}
                                onChange={handleChange}
                                required
                                style={{ fontSize: '1.2rem', padding: '1.1rem', background: 'rgba(255,255,255,0.03)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.8rem', color: '#cbd5e1', fontWeight: '500' }}>Time (Min)</label>
                            <div style={{ position: 'relative' }}>
                                <Clock size={20} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '1.15rem' }} />
                                <input
                                    type="number"
                                    name="time_limit"
                                    placeholder="30"
                                    value={formData.time_limit}
                                    onChange={handleChange}
                                    required
                                    style={{ padding: '1.1rem 1.1rem 1.1rem 3.5rem', fontSize: '1.2rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
                        <Sparkles size={20} /> Initialize Quiz
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateQuiz;
