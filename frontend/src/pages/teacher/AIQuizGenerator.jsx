import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Clock, BarChart, ArrowRight, X, CheckCircle, Loader2, Save } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AIQuizGenerator = ({ onClose, onQuizGenerated }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        topic: '',
        difficulty: 'Medium',
        count: 5
    });
    const [error, setError] = useState('');

    const generateQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://127.0.0.1:5001/api/ai/generate-quiz', {
                topic: formData.topic,
                difficulty: formData.difficulty,
                questionCount: formData.count
            });
            onQuizGenerated(res.data, formData);
            onClose(); // Close modal on success
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to generate quiz. Is the API Key configured?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card"
                style={{ width: 'min(90%, 550px)', padding: '2.5rem', border: '1px solid var(--primary-dim)' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                            <div style={{ padding: '0.5rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px' }}>
                                <Sparkles size={24} className="text-primary" />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AI Quiz Architect</h2>
                        </div>
                        <p className="text-secondary">Generate a complete quiz in seconds using advanced AI.</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                {error && (
                    <div className="bg-danger-soft" style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={generateQuiz}>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Topic or Subject</label>
                            <input
                                type="text"
                                placeholder="e.g. Quantum Physics, History of Rome, JavaScript Basics"
                                value={formData.topic}
                                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                required
                                autoFocus
                                style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Difficulty</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Number of Questions</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={formData.count}
                                    onChange={e => setFormData({ ...formData, count: e.target.value })}
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2.5rem' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} /> Generate Quiz
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <style>{`
                    .spin { animation: spin 1s linear infinite; }
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                `}</style>
            </motion.div>
        </div>
    );
};

export default AIQuizGenerator;
