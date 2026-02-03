import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExamAnalysis = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResult();
    }, []);

    const fetchResult = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:5001/api/exam/results/${resultId}`);
            const found = res.data;

            if (found) {
                // Fetch full questions to map ID to Text
                const qRes = await axios.get(`http://127.0.0.1:5001/api/exam/questions/${found.exam_id._id}`);
                const fullResult = {
                    ...found,
                    answers: found.answers.map(ans => {
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
        try {
            const doc = new jsPDF();

            // Title
            doc.setFontSize(22);
            doc.setTextColor(99, 102, 241); // Indigo color
            doc.text("Certificate of Completion", 105, 30, null, null, "center");

            // Subtitle
            doc.setFontSize(16);
            doc.setTextColor(100);

            const studentName = result.student_id.user
                ? `${result.student_id.user.first_name} ${result.student_id.user.last_name || ''}`
                : 'Student';

            doc.text(`This certifies that ${studentName}`, 105, 50, null, null, "center");
            doc.text(`has successfully completed the exam: ${result.exam_id.course_name}`, 105, 60, null, null, "center");

            // Score
            doc.setFontSize(20);
            doc.setTextColor(0);
            doc.text(`Score: ${result.marks} / ${result.total_marks}`, 105, 80, null, null, "center");

            // Table of Answers
            autoTable(doc, {
                startY: 100,
                head: [['Question', 'Your Answer', 'Correct Answer', 'Result']],
                body: result.answers.map(ans => [
                    ans.questionText || 'Question',
                    ans.selected_option || 'Skipped',
                    ans.correctAnswer,
                    ans.is_correct ? 'Correct' : 'Wrong'
                ]),
            });

            doc.save(`Result_${result.exam_id.course_name}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. check console for details.");
        }
    };

    if (loading) return <div style={{ paddingTop: '8rem', textAlign: 'center' }}>Loading Analysis...</div>;
    if (!result) return <div style={{ paddingTop: '8rem', textAlign: 'center' }}>Result not found.</div>;

    return (
        <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/student-dashboard')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem' }}
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Performance Analysis</h1>
                <button onClick={downloadPDF} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', padding: '0.6rem 1.2rem' }}>
                    <Download size={18} /> Download Result
                </button>
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Total Score</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{result.marks} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ {result.total_marks}</span></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Percentage</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: result.marks / result.total_marks >= 0.5 ? '#34d399' : '#f87171' }}>
                        {Math.round((result.marks / result.total_marks) * 100)}%
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {result.answers.map((ans, i) => (
                    <div key={i} className="glass-card" style={{ padding: '1.5rem', background: ans.is_correct ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', border: ans.is_correct ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                            <div style={{ marginTop: '0.2rem' }}>
                                {ans.is_correct ? <CheckCircle color="#34d399" /> : <XCircle color="#f87171" />}
                            </div>
                            <div style={{ width: '100%' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: '1.5' }}>{ans.questionText || `Question ${i + 1}`}</h3>
                                <div className="responsive-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                                    <div style={{ padding: '0.8rem', borderRadius: '8px', background: ans.is_correct ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: ans.is_correct ? '#34d399' : '#f87171' }}>
                                        <span style={{ opacity: 0.7, marginRight: '0.5rem' }}>Your Answer:</span>
                                        <strong>{ans.selected_option || 'Skipped'}</strong>
                                    </div>
                                    {!ans.is_correct && (
                                        <div style={{ padding: '0.8rem', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}>
                                            <span style={{ opacity: 0.7, marginRight: '0.5rem' }}>Correct Answer:</span>
                                            <strong>{ans.correctAnswer}</strong>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExamAnalysis;
