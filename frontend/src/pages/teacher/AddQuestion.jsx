import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Edit2, Plus, X, CheckCircle } from 'lucide-react';

const AddQuestion = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState('');

    const [formData, setFormData] = useState({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: 'Option1',
        marks: ''
    });

    useEffect(() => { fetchQuestions(); }, [courseId]);

    const fetchQuestions = async () => {
        try {
            const res = await api.get(`/exam/questions/${courseId}`);
            setQuestions(res.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                await api.put(`/exam/questions/${editId}`, { course_id: courseId, ...formData });
                showToast('Question updated successfully!');
            } else {
                await api.post('/exam/questions', { course_id: courseId, ...formData });
                showToast('Question added successfully!');
            }
            resetForm();
            fetchQuestions();
        } catch (error) {
            console.error('Error saving question:', error);
            showToast('Failed to save question.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await api.delete(`/exam/questions/${id}`);
            fetchQuestions();
            showToast('Question deleted.');
        } catch (error) {
            showToast('Failed to delete.');
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
        setFormData({ question: '', option1: '', option2: '', option3: '', option4: '', answer: 'Option1', marks: '' });
        setEditId(null);
    };

    const answerLabel = { Option1: 'A', Option2: 'B', Option3: 'C', Option4: 'D' };

    return (
        <div style={{ padding: '6rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', fontFamily: 'inherit' }}>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem', background: '#0f172a',
                    color: 'white', padding: '0.85rem 1.5rem', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    fontSize: '0.9rem', fontWeight: 600, zIndex: 9999,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}>
                    <CheckCircle size={16} color="#34d399" /> {toast}
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/teacher-dashboard')}
                    style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.95rem' }}
                >
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Manage Questions</h1>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Add, edit or remove questions for this quiz.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* ── Form ── */}
                <div style={{
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px',
                    padding: '2rem', position: 'sticky', top: '90px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                }}>
                    {/* Form Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: '#eef2ff', padding: '0.6rem', borderRadius: '10px' }}>
                                {editId ? <Edit2 size={20} color="#6366f1" /> : <Plus size={20} color="#6366f1" />}
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                                {editId ? 'Edit Question' : 'Add New Question'}
                            </h3>
                        </div>
                        {editId && (
                            <button onClick={resetForm} style={{
                                background: 'none', border: '1.5px solid #cbd5e1', color: '#64748b',
                                padding: '4px 12px', borderRadius: '100px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600
                            }}>
                                <X size={13} /> Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        {/* Question */}
                        <div>
                            <label style={labelStyle}>Question Text</label>
                            <textarea
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Enter the question..."
                                style={inputStyle({ multiline: true })}
                            />
                        </div>

                        {/* Options 2x2 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {['option1','option2','option3','option4'].map((opt, i) => (
                                <div key={opt}>
                                    <label style={labelStyle}>Option {String.fromCharCode(65 + i)}</label>
                                    <input
                                        type="text"
                                        name={opt}
                                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                        value={formData[opt]}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle()}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Correct Answer + Marks */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={labelStyle}>Correct Answer</label>
                                <select name="answer" value={formData.answer} onChange={handleChange} style={inputStyle()}>
                                    <option value="Option1">Option A</option>
                                    <option value="Option2">Option B</option>
                                    <option value="Option3">Option C</option>
                                    <option value="Option4">Option D</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Marks for this Question</label>
                                <input
                                    type="number"
                                    name="marks"
                                    placeholder="e.g. 5"
                                    min="1"
                                    value={formData.marks}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle()}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '0.25rem', padding: '0.9rem', borderRadius: '10px',
                                background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white', border: 'none', fontWeight: 700, fontSize: '0.95rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
                            }}
                        >
                            <Save size={17} /> {loading ? 'Saving...' : editId ? 'Update Question' : 'Save Question'}
                        </button>
                    </form>
                </div>

                {/* ── Question List ── */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Existing Questions</h3>
                        <span style={{ background: '#6366f1', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '100px' }}>
                            {questions.length}
                        </span>
                    </div>

                    {questions.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '3rem', color: '#94a3b8',
                            border: '2px dashed #e2e8f0', borderRadius: '14px',
                            background: '#f8fafc'
                        }}>
                            <Plus size={32} color="#cbd5e1" style={{ marginBottom: '0.5rem' }} />
                            <p style={{ margin: 0 }}>No questions added yet. Add your first one!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {questions.map((q, i) => (
                                <div key={q._id} style={{
                                    background: '#fff', border: '1px solid #e2e8f0',
                                    borderLeft: '4px solid #6366f1', borderRadius: '12px',
                                    padding: '1.1rem 1.25rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Q{i + 1} · {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                            <button onClick={() => handleEdit(q)} title="Edit" style={iconBtnStyle('#eef2ff', '#6366f1')}><Edit2 size={15} /></button>
                                            <button onClick={() => handleDelete(q._id)} title="Delete" style={iconBtnStyle('#fef2f2', '#ef4444')}><Trash2 size={15} /></button>
                                        </div>
                                    </div>

                                    <p style={{ margin: '0 0 0.85rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.5, fontSize: '0.95rem' }}>{q.question}</p>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                                        {['option1','option2','option3','option4'].map((opt, idx) => {
                                            const isCorrect = q.answer === `Option${idx + 1}`;
                                            return (
                                                <div key={opt} style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    padding: '5px 10px', borderRadius: '8px',
                                                    background: isCorrect ? '#ecfdf5' : '#f8fafc',
                                                    border: `1px solid ${isCorrect ? '#6ee7b7' : '#e2e8f0'}`,
                                                    fontSize: '0.82rem', fontWeight: isCorrect ? 700 : 500,
                                                    color: isCorrect ? '#059669' : '#475569'
                                                }}>
                                                    {isCorrect && <CheckCircle size={12} />}
                                                    <span style={{ minWidth: '14px', fontWeight: 700 }}>{String.fromCharCode(65 + idx)}.</span>
                                                    {q[opt]}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Responsive */}
            <style>{`
                @media (max-width: 900px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

const labelStyle = {
    display: 'block', marginBottom: '5px',
    fontSize: '0.8rem', fontWeight: 700,
    color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px'
};

const inputStyle = (opts = {}) => ({
    width: '100%', padding: '0.75rem 0.9rem',
    border: '1.5px solid #e2e8f0', borderRadius: '8px',
    background: '#f8fafc', color: '#0f172a',
    fontSize: '0.9rem', fontFamily: 'inherit',
    boxSizing: 'border-box',
    resize: opts.multiline ? 'vertical' : 'none',
    outline: 'none', transition: 'border-color 0.2s',
});

const iconBtnStyle = (bg, color) => ({
    background: bg, border: 'none', color,
    width: '30px', height: '30px', borderRadius: '8px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'opacity 0.2s'
});

export default AddQuestion;
