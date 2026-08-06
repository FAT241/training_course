import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, Circle, X } from 'lucide-react';
import api from '../../utils/api';

export default function QuizDetail() {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Modals
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    
    const [questionContent, setQuestionContent] = useState('');
    const [answerForm, setAnswerForm] = useState({ answer_content: '', is_correct: false });

    useEffect(() => {
        fetchQuiz();
    }, [chapterId]);

    const fetchQuiz = async () => {
        try {
            const res = await api.get(`/chapters/${chapterId}/quiz`);
            setQuiz(res.data);
            setLoading(false);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setQuiz(null); // Chưa có quiz
            } else {
                console.error("Lỗi lấy quiz:", err);
            }
            setLoading(false);
        }
    };

    const handleCreateQuiz = async () => {
        try {
            // Điểm chuẩn mặc định là 50 (Có thể sửa sau)
            await api.post(`/chapters/${chapterId}/quiz`, { passing_score: 50 });
            fetchQuiz();
        } catch (err) {
            alert('Lỗi tạo quiz');
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/chapters/quiz/${quiz.id}/questions`, { question_content: questionContent });
            setQuestionContent('');
            setIsQuestionModalOpen(false);
            fetchQuiz();
        } catch (err) {
            alert('Lỗi thêm câu hỏi');
        }
    };

    const handleAddAnswer = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/chapters/questions/${selectedQuestionId}/answers`, answerForm);
            setIsAnswerModalOpen(false);
            fetchQuiz();
        } catch (err) {
            alert('Lỗi thêm đáp án');
        }
    };

    const openAnswerModal = (qId) => {
        setSelectedQuestionId(qId);
        setAnswerForm({ answer_content: '', is_correct: false });
        setIsAnswerModalOpen(true);
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="course-detail-container" style={{ padding: '1rem 0' }}>
            <div className="course-detail-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ color: 'var(--fpt-blue)', margin: 0, fontSize: '1.25rem' }}>Quản lý Trắc nghiệm (Quiz)</h2>
            </div>

            {!quiz ? (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ color: '#4B5563', marginBottom: '1rem' }}>Chương này chưa có bài kiểm tra</h3>
                    <button className="btn-primary create-btn" onClick={handleCreateQuiz}>
                        Tạo bài kiểm tra (Quiz)
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ color: '#374151', margin: 0 }}>Danh sách Câu hỏi</h3>
                        <button className="btn-primary" onClick={() => setIsQuestionModalOpen(true)}>
                            <Plus size={16} /> Thêm câu hỏi
                        </button>
                    </div>

                    {quiz.questions?.length === 0 && <div style={{ color: '#9CA3AF', textAlign: 'center', marginTop: '2rem' }}>Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</div>}

                    {quiz.questions?.map((q, index) => (
                        <div key={q.id} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--fpt-orange)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1F2937' }}>Câu {index + 1}: {q.question_content}</h4>
                                <button className="btn-secondary" onClick={() => openAnswerModal(q.id)} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>+ Đáp án</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '1rem' }}>
                                {q.answers?.length === 0 && <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Chưa có đáp án.</span>}
                                {q.answers?.map(ans => (
                                    <div key={ans.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem', backgroundColor: ans.is_correct ? '#ECFDF5' : '#F9FAFB', borderRadius: '4px', border: ans.is_correct ? '1px solid #A7F3D0' : '1px solid transparent' }}>
                                        {ans.is_correct ? <CheckCircle size={16} color="#10B981" /> : <Circle size={16} color="#9CA3AF" />}
                                        <span style={{ color: ans.is_correct ? '#065F46' : '#4B5563', fontWeight: ans.is_correct ? '500' : 'normal' }}>
                                            {ans.answer_content}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Modal Thêm Câu hỏi */}
            {isQuestionModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Thêm Câu hỏi</h3>
                            <button className="modal-close-btn" type="button" onClick={() => setIsQuestionModalOpen(false)}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleAddQuestion}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nội dung câu hỏi</label>
                                    <textarea className="form-control" rows="3" required
                                        value={questionContent} onChange={e => setQuestionContent(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsQuestionModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary create-btn">Lưu câu hỏi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Thêm Đáp án */}
            {isAnswerModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Thêm Đáp án</h3>
                            <button className="modal-close-btn" type="button" onClick={() => setIsAnswerModalOpen(false)}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleAddAnswer}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nội dung đáp án</label>
                                    <input type="text" className="form-control" required
                                        value={answerForm.answer_content} onChange={e => setAnswerForm({...answerForm, answer_content: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
                                    <input type="checkbox" id="is_correct" 
                                        checked={answerForm.is_correct} onChange={e => setAnswerForm({...answerForm, is_correct: e.target.checked})} 
                                        style={{ width: '18px', height: '18px' }}/>
                                    <label htmlFor="is_correct" style={{ margin: 0, fontWeight: 'bold', color: '#10B981', cursor: 'pointer' }}>Đây là đáp án ĐÚNG</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsAnswerModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary create-btn">Lưu đáp án</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
