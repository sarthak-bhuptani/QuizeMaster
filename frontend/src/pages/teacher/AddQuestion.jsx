import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, HelpCircle, CheckCircle, Trash2, Edit2, Plus, X } from 'lucide-react';

const AddQuestion = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: 'Option1',
        marks: ''
    });

    useEffect(() => {
        fetchQuestions();
    }, [courseId]);

    const fetchQuestions = async () => {
        try {
            const res = await api.get(`/exam/questions/${courseId}`);
            setQuestions(res.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                // Update
                await api.put(`/exam/questions/${editId}`, {
                    course_id: courseId,
                    ...formData
                });
                alert('Question Updated!');
            } else {
                // Add
                await api.post('/exam/questions', {
                    course_id: courseId,
                    ...formData
                });
                alert('Question Added!');
            }

            resetForm();
            fetchQuestions();
        } catch (error) {
            console.error('Error saving question:', error);
            alert('Failed to save question');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this question?")) return;
        try {
            await api.delete(`/exam/questions/${id}`);
            fetchQuestions();
        } catch (error) {
            console.error(error);
            alert("Failed to delete");
        }
    };

    const handleEdit = (q) => {
        setFormData({
            question: q.question,
            option1: q.option1,
            option2: q.option2,
            option3: q.option3,
            option4: q.option4,
            answer: q.answer,
            marks: q.marks
        });
        setEditId(q._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: 'Option1',
            marks: ''
        });
        setEditId(null);
    };

    return (
        <div className="manage-container">
            <style>{`
                .manage-container { padding: 8rem 2rem 4rem; max-width: 1200px; margin: 0 auto; min-height: 100vh; }
                .glass-card {
                    background: rgba(30, 41, 59, 0.4);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
                .question-item {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    transition: all 0.2s;
                }
                .question-item:hover { transform: translateX(5px); background: rgba(255,255,255,0.05); }
                .btn-icon { padding: 0.5rem; border-radius: 8px; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .btn-edit { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
                .btn-delete { background: rgba(239, 68, 68, 0.1); color: #f87171; }
                .btn-edit:hover { background: rgba(99, 102, 241, 0.2); }
                .btn-delete:hover { background: rgba(239, 68, 68, 0.2); }
                
                @media (max-width: 900px) {
                    .grid-layout { grid-template-columns: 1fr; }
                    .form-section { order: 1; }
                    .list-section { order: 2; }
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => navigate('/teacher-dashboard')}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </motion.button>
                <h2 style={{ margin: 0 }}>Manage Questions</h2>
            </div>

            <div className="grid-layout">
                {/* FORM SECTION */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card form-section"
                    style={{ padding: '2rem', position: 'sticky', top: '100px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.8rem', borderRadius: '12px' }}>
                                {editId ? <Edit2 size={24} color="#818cf8" /> : <Plus size={24} color="#818cf8" />}
                            </div>
                            <h3 style={{ margin: 0 }}>{editId ? 'Edit Question' : 'Add New Question'}</h3>
                        </div>
                        {editId && (
                            <button onClick={resetForm} style={{ background: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8', padding: '0.3rem 0.8rem', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                                <X size={14} /> Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Question Text</label>
                            <textarea
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontFamily: 'inherit', minHeight: '80px' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                            {['option1', 'option2', 'option3', 'option4'].map((opt, i) => (
                                <div key={opt}>
                                    <input
                                        type="text"
                                        name={opt}
                                        placeholder={`Option ${i + 1}`}
                                        value={formData[opt]}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Correct Answer</label>
                                <select name="answer" value={formData.answer} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                                    <option value="Option1">Option 1</option>
                                    <option value="Option2">Option 2</option>
                                    <option value="Option3">Option 3</option>
                                    <option value="Option4">Option 4</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Marks</label>
                                <input type="number" name="marks" value={formData.marks} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                            <Save size={18} /> {loading ? 'Saving...' : editId ? 'Update Question' : 'Save Question'}
                        </button>
                    </form>
                </motion.div>

                {/* LIST SECTION */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="list-section">
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Existing Questions <span style={{ background: '#334155', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>{questions.length}</span>
                    </h3>

                    {questions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                            No questions added yet.
                        </div>
                    ) : (
                        questions.map((q, i) => (
                            <div key={q._id} className="question-item">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold', color: '#cbd5e1' }}>Q{i + 1}.</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEdit(q)} className="btn-icon btn-edit" title="Edit"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(q._id)} className="btn-icon btn-delete" title="Delete"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>{q.question}</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                    <div style={{ color: q.answer === 'Option1' ? '#34d399' : 'inherit' }}>A: {q.option1}</div>
                                    <div style={{ color: q.answer === 'Option2' ? '#34d399' : 'inherit' }}>B: {q.option2}</div>
                                    <div style={{ color: q.answer === 'Option3' ? '#34d399' : 'inherit' }}>C: {q.option3}</div>
                                    <div style={{ color: q.answer === 'Option4' ? '#34d399' : 'inherit' }}>D: {q.option4}</div>
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '1rem' }}>
                                    <span>Marks: {q.marks}</span>
                                    <span>Answer: {q.answer}</span>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AddQuestion;
