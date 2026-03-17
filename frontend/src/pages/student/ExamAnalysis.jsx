import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExamAnalysis = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResult();
    }, [resultId]);

    const fetchResult = async () => {
        try {
            const res = await api.get(`/exam/results/${resultId}`);
            const found = res.data;

            if (found) {
                // Fetch full questions to map ID to Text
                const examId = found.exam_id._id || found.exam_id;
                const qRes = await api.get(`/exam/questions/${examId}`);
                const fullResult = {
                    ...found,
                    answers: (found.answers || []).map(ans => {
                        const qDetails = qRes.data.find(q => q._id === ans.question_id);
                        return {
                            ...ans,
                            questionText: qDetails?.question,
                            correctAnswer: qDetails?.answer
                        };
                    })
                };
                setResult(fullResult);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!result) return;
        try {
            const doc = new jsPDF();

            // Title
            doc.setFontSize(22);
            doc.setTextColor(99, 102, 241); 
            doc.text("Certificate of Completion", 105, 30, null, null, "center");

            // Subtitle
            doc.setFontSize(16);
            doc.setTextColor(100);

            const studentName = result.student_id?.user
                ? `${result.student_id.user.first_name} ${result.student_id.user.last_name || ''}`
                : 'Student';

            doc.text(`This certifies that ${studentName}`, 105, 50, null, null, "center");
            doc.text(`has successfully completed the exam: ${result.exam_id?.course_name || 'Exam'}`, 105, 60, null, null, "center");

            // Score
            doc.setFontSize(20);
            doc.setTextColor(0);
            doc.text(`Score: ${result.marks} / ${result.total_marks}`, 105, 80, null, null, "center");

            // Table of Answers
            autoTable(doc, {
                startY: 100,
                head: [['Question', 'Your Answer', 'Correct Answer', 'Result']],
                body: (result.answers || []).map(ans => [
                    ans.questionText || 'Question',
                    ans.selected_option || 'Skipped',
                    ans.correctAnswer || 'N/A',
                    ans.is_correct ? 'Correct' : 'Wrong'
                ]),
            });

            doc.save(`Result_${result.exam_id?.course_name || 'Analysis'}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. check console for details.");
        }
    };

    if (loading) return <div style={{ paddingTop: '8rem', textAlign: 'center' }}>Loading Analysis...</div>;
    if (!result) return <div style={{ paddingTop: '8rem', textAlign: 'center' }}>Result not found.</div>;

    const passStatus = (result.marks / result.total_marks) >= 0.5;

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#f8fafc', 
            padding: '2rem 1rem',
            color: '#1e293b'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/student-dashboard')}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600 }}
                >
                    <ArrowLeft size={18} /> Back
                </button>

                <div style={{ 
                    display: 'flex', 
                    flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: window.innerWidth < 640 ? 'flex-start' : 'center', 
                    marginBottom: '2rem',
                    background: 'white',
                    padding: window.innerWidth < 640 ? '1.5rem' : '2.5rem',
                    borderRadius: '24px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    gap: '1.5rem'
                }}>
                    <div>
                        <h1 style={{ fontSize: window.innerWidth < 640 ? '1.5rem' : '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.2 }}>Exam Results</h1>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Review your performance summary.</p>
                    </div>
                    <div style={{ 
                        textAlign: window.innerWidth < 640 ? 'left' : 'center',
                        display: 'flex',
                        flexDirection: window.innerWidth < 640 ? 'row' : 'column',
                        alignItems: window.innerWidth < 640 ? 'center' : 'center',
                        gap: window.innerWidth < 640 ? '1rem' : '0.25rem',
                        background: window.innerWidth < 640 ? '#f8fafc' : 'transparent',
                        padding: window.innerWidth < 640 ? '1rem' : '0',
                        borderRadius: '12px',
                        width: window.innerWidth < 640 ? '100%' : 'auto'
                    }}>
                        <div style={{ fontSize: window.innerWidth < 640 ? '1.8rem' : '2.8rem', fontWeight: 900, color: '#3b82f6', lineHeight: '1' }}>
                            {result.marks} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>/ {result.total_marks}</span>
                        </div>
                        <div style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 800, 
                            color: passStatus ? '#10b981' : '#ef4444',
                            border: `1px solid ${passStatus ? '#dcfce7' : '#fee2e2'}`,
                            background: passStatus ? '#f0fdf4' : '#fef2f2',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            letterSpacing: '0.5px'
                        }}>
                            {passStatus ? 'PASSED' : 'NOT PASSED'}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: window.innerWidth < 480 ? 'column' : 'row', gap: '1rem', marginBottom: '2.5rem' }}>
                    <button onClick={downloadPDF} className="btn" style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.6rem', 
                        padding: '0.9rem 1.5rem', 
                        borderRadius: '14px', 
                        background: 'white', 
                        border: '1px solid #e2e8f0', 
                        color: '#475569', 
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        width: window.innerWidth < 480 ? '100%' : 'auto'
                    }}>
                        <Download size={19} /> Download Analysis PDF
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {(result.answers || []).map((ans, i) => (
                        <div 
                            key={i} 
                            style={{ 
                                padding: '1.5rem', 
                                borderRadius: '16px',
                                background: 'white', 
                                border: `1px solid ${ans.is_correct ? '#dcfce7' : '#fee2e2'}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                <div style={{ 
                                    width: '32px', 
                                    height: '32px', 
                                    borderRadius: '50%', 
                                    background: ans.is_correct ? '#dcfce7' : '#fee2e2', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    marginTop: '0.25rem'
                                }}>
                                    {ans.is_correct ? <CheckCircle size={18} color="#16a34a" /> : <XCircle size={18} color="#dc2626" />}
                                </div>
                                <div style={{ width: '100%' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#334155' }}>
                                        {ans.questionText || `Question ${i + 1}`}
                                    </h3>
                                    
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', flex: '1', minWidth: '200px' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.25rem' }}>YOUR ANSWER</div>
                                            <div style={{ fontWeight: 600, color: ans.is_correct ? '#16a34a' : '#dc2626' }}>{ans.selected_option || 'No Answer'}</div>
                                        </div>
                                        {!ans.is_correct && (
                                            <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #dcfce7', flex: '1', minWidth: '200px' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.25rem' }}>CORRECT ANSWER</div>
                                                <div style={{ fontWeight: 600, color: '#16a34a' }}>{ans.correctAnswer || 'N/A'}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExamAnalysis;
