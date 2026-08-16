import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle2, Circle, X, Save, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function QuizDetail() {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Combined state for Question & Answers
    const initialQuestionData = {
        question_content: '',
        answers: [
            { id: 1, answer_content: '', is_correct: true },
            { id: 2, answer_content: '', is_correct: false },
            { id: 3, answer_content: '', is_correct: false },
            { id: 4, answer_content: '', is_correct: false },
        ]
    };
    const [questionData, setQuestionData] = useState(initialQuestionData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

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
            await api.post(`/chapters/${chapterId}/quiz`, { passing_score: 50 });
            fetchQuiz();
            toast.success('Tạo bài kiểm tra thành công!');
        } catch (err) {
            toast.error('Lỗi tạo bài kiểm tra');
        }
    };

    const handleAnswerChange = (id, field, value) => {
        setQuestionData(prev => {
            const newAnswers = prev.answers.map(ans => {
                if (ans.id === id) {
                    return { ...ans, [field]: value };
                }
                // Nếu đang set is_correct = true, thì các đáp án khác phải là false
                if (field === 'is_correct' && value === true) {
                    return { ...ans, is_correct: false };
                }
                return ans;
            });
            return { ...prev, answers: newAnswers };
        });
    };

    const handleAddQuestionWithAnswers = async (e) => {
        e.preventDefault();
        
        if (!questionData.question_content.trim()) {
            return toast.error('Vui lòng nhập nội dung câu hỏi');
        }

        const validAnswers = questionData.answers.filter(a => a.answer_content.trim() !== '');
        if (validAnswers.length < 2) {
            return toast.error('Vui lòng nhập ít nhất 2 đáp án');
        }

        const hasCorrectAnswer = validAnswers.some(a => a.is_correct);
        if (!hasCorrectAnswer) {
            return toast.error('Vui lòng chọn 1 đáp án đúng');
        }

        setIsSubmitting(true);
        try {
            // 1. Tạo câu hỏi
            const qRes = await api.post(`/chapters/quiz/${quiz.id}/questions`, { 
                question_content: questionData.question_content 
            });
            const questionId = qRes.data.id;
            
            // 2. Tạo tất cả đáp án hợp lệ cùng lúc
            await Promise.all(
                validAnswers.map(ans => 
                    api.post(`/chapters/questions/${questionId}/answers`, {
                        answer_content: ans.answer_content,
                        is_correct: ans.is_correct
                    })
                )
            );
            
            setQuestionData(initialQuestionData);
            setIsModalOpen(false);
            fetchQuiz();
            toast.success('Đã lưu Câu hỏi & Đáp án thành công!');
        } catch (err) {
            toast.error('Có lỗi xảy ra khi lưu câu hỏi');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            if (deleteTarget.type === 'question') {
                await api.delete(`/chapters/questions/${deleteTarget.id}`);
                toast.success('Xóa câu hỏi thành công');
            } else if (deleteTarget.type === 'quiz') {
                await api.delete(`/chapters/quiz/${quiz.id}`);
                toast.success('Xóa bài kiểm tra thành công');
                setQuiz(null); // Reset quiz state
            }
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
            fetchQuiz();
        } catch (err) {
            toast.error('Có lỗi xảy ra khi xóa!');
        }
    };

    const openDeleteModal = (type, id = null) => {
        setDeleteTarget({ type, id });
        setIsDeleteModalOpen(true);
    };

    const openModal = () => {
        setQuestionData(initialQuestionData);
        setIsModalOpen(true);
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

    return (
        <div className="course-list-container">
            <div className="course-list-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '8px', display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2 style={{ margin: 0, color: 'white', fontSize: '1.25rem', fontWeight: '700' }}>Soạn Bài Kiểm Tra (Quiz)</h2>
                </div>
            </div>

            {!quiz ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ display: 'inline-flex', padding: '1.2rem', backgroundColor: 'rgba(14, 165, 233, 0.15)', borderRadius: '50%', color: '#38bdf8', marginBottom: '1rem' }}>
                        <Plus size={32} />
                    </div>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '700' }}>Chưa có bài kiểm tra</h3>
                    <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>Chương này hiện chưa có bài kiểm tra nào được tạo.</p>
                    <button className="btn-primary create-btn" onClick={handleCreateQuiz} style={{ margin: '0 auto' }}>
                        <Plus size={18} /> Bắt đầu tạo bài kiểm tra
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div>
                            <h3 style={{ color: 'white', margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '700' }}>Danh sách Câu hỏi</h3>
                            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem' }}>Tổng số: {quiz.questions?.length || 0} câu</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-secondary" onClick={() => openDeleteModal('quiz')} style={{ color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
                                <Trash2 size={18} /> Xóa toàn bộ Quiz
                            </button>
                            <button className="btn-primary create-btn" onClick={openModal}>
                                <Plus size={18} /> Thêm câu hỏi
                            </button>
                        </div>
                    </div>

                    {quiz.questions?.length === 0 && (
                        <div style={{ padding: '3rem', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', textAlign: 'center', color: '#94a3b8', border: '2px dashed rgba(255, 255, 255, 0.2)' }}>
                            Chưa có câu hỏi nào. Hãy bấm "Thêm câu hỏi" để bắt đầu!
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {quiz.questions?.map((q, index) => (
                            <div key={q.id} style={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.7)', 
                                borderRadius: '16px', 
                                padding: '1.5rem', 
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderLeft: '4px solid var(--fpt-orange)', 
                                transition: 'all 0.2s ease'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white', fontWeight: '600' }}>
                                        <span style={{ color: 'var(--fpt-orange)' }}>Câu {index + 1}:</span> {q.question_content}
                                    </h4>
                                    <button 
                                        onClick={() => openDeleteModal('question', q.id)} 
                                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                                        title="Xóa câu hỏi này"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                                    {q.answers?.length === 0 && <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Chưa có đáp án.</span>}
                                    {q.answers?.map((ans, aIdx) => (
                                        <div key={ans.id} style={{ 
                                            display: 'flex', 
                                            alignItems: 'flex-start', 
                                            gap: '10px', 
                                            padding: '12px', 
                                            backgroundColor: ans.is_correct ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.5)', 
                                            borderRadius: '8px', 
                                            border: ans.is_correct ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)' 
                                        }}>
                                            <div style={{ marginTop: '2px' }}>
                                                {ans.is_correct ? <CheckCircle2 size={18} color="#34d399" /> : <Circle size={18} color="#94a3b8" />}
                                            </div>
                                            <span style={{ 
                                                color: ans.is_correct ? '#6ee7b7' : '#cbd5e1', 
                                                fontWeight: ans.is_correct ? '600' : '400',
                                                fontSize: '0.95rem',
                                                lineHeight: '1.4'
                                            }}>
                                                <span style={{ fontWeight: '600', marginRight: '4px' }}>
                                                    {String.fromCharCode(65 + aIdx)}.
                                                </span>
                                                {ans.answer_content}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Modal Thêm Câu hỏi & Đáp án */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>Tạo Câu hỏi & Đáp án</h3>
                            <button className="modal-close-btn" type="button" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleAddQuestionWithAnswers}>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="form-group">
                                    <label>Nội dung câu hỏi <span style={{ color: 'red' }}>*</span></label>
                                    <textarea className="form-control" rows="3" required
                                        placeholder="Nhập nội dung câu hỏi..."
                                        value={questionData.question_content} 
                                        onChange={e => setQuestionData({...questionData, question_content: e.target.value})}></textarea>
                                </div>
                                
                                <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                                    <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0F172A' }}>Các phương án trả lời</label>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>Chọn nút Radio bên cạnh để đánh dấu Đáp án ĐÚNG (chỉ chọn 1).</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {questionData.answers.map((ans, idx) => (
                                        <div key={ans.id} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '12px', 
                                            padding: '12px', 
                                            backgroundColor: ans.is_correct ? '#F0FDF4' : '#F8FAFC', 
                                            border: ans.is_correct ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '4px' }}>
                                                <input 
                                                    type="radio" 
                                                    name="correct_answer" 
                                                    checked={ans.is_correct}
                                                    onChange={() => handleAnswerChange(ans.id, 'is_correct', true)}
                                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                />
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontWeight: '600', color: ans.is_correct ? '#166534' : '#64748B', width: '20px' }}>
                                                    {String.fromCharCode(65 + idx)}.
                                                </span>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder={`Nhập đáp án ${String.fromCharCode(65 + idx)}...`}
                                                    value={ans.answer_content}
                                                    onChange={e => handleAnswerChange(ans.id, 'answer_content', e.target.value)}
                                                    style={{ 
                                                        backgroundColor: 'white', 
                                                        border: ans.is_correct ? '1px solid #BBF7D0' : '1px solid #CBD5E1',
                                                        padding: '0.6rem 0.8rem'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                                <button type="submit" className="btn-primary create-btn" disabled={isSubmitting} style={{ minWidth: '120px' }}>
                                    {isSubmitting ? 'Đang lưu...' : <><Save size={18} /> Lưu tất cả</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal Xóa */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                            <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem', color: '#1F2937', fontSize: '1.25rem', fontWeight: 'bold' }}>Xác nhận xóa</h3>
                            <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                                {deleteTarget?.type === 'quiz' 
                                    ? 'Bạn có chắc chắn muốn xóa toàn bộ Bài kiểm tra này cùng tất cả câu hỏi không?' 
                                    : 'Bạn có chắc chắn muốn xóa câu hỏi này không?'}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Hủy</button>
                                <button type="button" className="btn-primary" style={{ backgroundColor: '#EF4444' }} onClick={handleDeleteConfirm}>
                                    Vâng, xóa nó
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
