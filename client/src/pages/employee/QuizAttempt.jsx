import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { CheckCircle, XCircle, ArrowLeft, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuizAttempt() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/employee/quizzes/${id}`);
                setQuiz(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleSelect = (questionId, answerId) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedAnswers).length < quiz.questions.length) {
            toast.error('Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài!');
            return;
        }

        setSubmitting(true);
        try {
            const answersPayload = Object.keys(selectedAnswers).map(qId => ({
                questionId: parseInt(qId),
                answerId: selectedAnswers[qId]
            }));

            const res = await api.post(`/employee/quizzes/${id}/submit`, { answers: answersPayload });
            setResult(res.data);
            if(res.data.isPassed) {
                toast.success('Nộp bài thành công!');
            } else {
                toast.error('Nộp bài thành công, nhưng bạn chưa qua môn.');
            }
        } catch (err) {
            toast.error('Lỗi nộp bài!');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>Đang tải đề thi...</div>;
    if (!quiz) return <div className="error-message">Không tìm thấy bài kiểm tra!</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontWeight: '600', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='#cbd5e1'}>
                    <ArrowLeft size={20} /> Trở về bài giảng
                </button>
                <h2 style={{ margin: 0, fontSize: '24px', color: 'white' }}>Bài kiểm tra đánh giá</h2>
            </div>

            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '32px', backdropFilter: 'blur(10px)', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', marginBottom: '32px', borderLeft: '4px solid #38bdf8' }}>
                    <p style={{ margin: 0, color: '#cbd5e1', fontSize: '15px' }}>
                        Điểm yêu cầu để qua môn: <strong style={{ color: '#38bdf8', fontSize: '16px' }}>{quiz.passing_score}%</strong> (Làm đúng tối thiểu {Math.ceil((quiz.passing_score / 100) * quiz.questions.length)} / {quiz.questions.length} câu). Hãy suy nghĩ cẩn thận trước khi chọn đáp án nhé!
                    </p>
                </div>

                {quiz.questions.map((q, index) => (
                    <div key={q.id} style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: index < quiz.questions.length - 1 ? '1px dashed rgba(255, 255, 255, 0.2)' : 'none' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '20px', color: 'white', lineHeight: '1.5' }}>
                            Câu {index + 1}: {q.question_content}
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {q.answers.map(ans => (
                                    <label 
                                        key={ans.id} 
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '14px', 
                                            padding: '16px 20px', 
                                            border: selectedAnswers[q.id] === ans.id ? '2px solid #38bdf8' : '2px solid rgba(255, 255, 255, 0.1)',
                                            backgroundColor: selectedAnswers[q.id] === ans.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: selectedAnswers[q.id] === ans.id ? '0 4px 6px -1px rgba(56,189,248,0.2)' : 'none'
                                        }}
                                        onMouseOver={e=> { if(selectedAnswers[q.id] !== ans.id) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)' }}
                                        onMouseOut={e=> { if(selectedAnswers[q.id] !== ans.id) e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.5)' }}
                                    >
                                        <input 
                                            type="radio" 
                                            name={`question-${q.id}`} 
                                            value={ans.id}
                                            checked={selectedAnswers[q.id] === ans.id}
                                            onChange={() => handleSelect(q.id, ans.id)}
                                            style={{ width: '20px', height: '20px', accentColor: '#38bdf8', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '15px', color: selectedAnswers[q.id] === ans.id ? '#38bdf8' : '#cbd5e1', fontWeight: selectedAnswers[q.id] === ans.id ? '600' : '500' }}>
                                            {ans.answer_content}
                                        </span>
                                    </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(14,165,233,0.3)' }}
            >
                {submitting ? 'Hệ thống đang chấm điểm...' : 'Nộp bài kiểm tra'}
            </button>

            {/* Modal Kết Quả */}
            {result && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ textAlign: 'center', padding: '40px', maxWidth: '450px' }}>
                        {result.isPassed ? (
                            <CheckCircle size={80} color="#10b981" style={{ margin: '0 auto 24px' }} />
                        ) : (
                            <XCircle size={80} color="#ef4444" style={{ margin: '0 auto 24px' }} />
                        )}
                        
                        <h2 style={{ fontSize: '26px', marginBottom: '12px', color: result.isPassed ? '#34d399' : '#f87171', fontWeight: '800' }}>
                            {result.isPassed ? 'Tuyệt vời! Bạn đã vượt qua.' : 'Rất tiếc! Chưa đạt yêu cầu.'}
                        </h2>
                        
                        <p style={{ fontSize: '16px', color: '#cbd5e1', marginBottom: '32px' }}>
                            Bạn làm đúng <strong style={{ color: 'white', fontSize: '20px' }}>{result.score}</strong> / {quiz.questions.length} câu. 
                            (Yêu cầu: {result.passingScore}%)
                        </p>

                        {result.newlyCertified && (
                            <div style={{ backgroundColor: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', padding: '20px', borderRadius: '12px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
                                <Award size={40} color="#d97706" />
                                <div style={{ textAlign: 'left' }}>
                                    <h4 style={{ margin: '0 0 4px 0', color: '#fbbf24', fontSize: '18px', fontWeight: '800' }}>Chúc mừng tốt nghiệp!</h4>
                                    <p style={{ margin: 0, color: '#fcd34d', fontSize: '14px', lineHeight: '1.4' }}>Tiến độ đạt 100%. Hệ thống đã tự động cấp chứng chỉ vào hồ sơ của bạn.</p>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexDirection: 'column' }}>
                            {!result.isPassed && (
                                <button onClick={() => window.location.reload()} className="btn-secondary" style={{ padding: '14px', width: '100%', fontSize: '15px' }}>
                                    Thử làm lại bài
                                </button>
                            )}
                            <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '14px', width: '100%', fontSize: '15px' }}>
                                Về trang chủ khóa học
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
