import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Video, FileText, X, Edit, Building, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Breadcrumb from '../../components/Breadcrumb';
import { SkeletonTable } from '../../components/SkeletonCard';
import ErrorState from '../../components/ErrorState';

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States for Modals
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedChapterId, setSelectedChapterId] = useState(null);

    // Editing states
    const [editingChapter, setEditingChapter] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);

    const [chapterForm, setChapterForm] = useState({ chapter_name: '', order_index: 1 });
    const [lessonForm, setLessonForm] = useState({ lesson_name: '', content_type: 'VIDEO', file_path: '', file: null });

    // Permission states
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [accessLevel, setAccessLevel] = useState('RESTRICTED');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [courseRes, deptsRes] = await Promise.all([
                api.get(`/courses/${id}`),
                api.get('/departments')
            ]);
            setCourse(courseRes.data);
            setDepartments(deptsRes.data);
            if (deptsRes.data.length > 0) setSelectedDepartmentId(deptsRes.data[0].id);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Không thể tải dữ liệu khóa học. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseDetail = async () => {
        try {
            const response = await api.get(`/courses/${id}`);
            setCourse(response.data);
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    // --- PERMISSION LOGIC ---
    const handleAddPermission = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/courses/${id}/permissions`, {
                department_id: selectedDepartmentId,
                access_level: accessLevel
            });
            fetchCourseDetail();
            toast.success('Thêm quyền thành công');
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRemovePermission = async (departmentId) => {
        if (!window.confirm('Xóa quyền của phòng ban này?')) return;
        try {
            await api.delete(`/courses/${id}/permissions/${departmentId}`);
            fetchCourseDetail();
            toast.success('Xóa quyền thành công');
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    // --- CHAPTER LOGIC ---
    const openAddChapterModal = () => {
        setEditingChapter(null);
        setChapterForm({ chapter_name: '', order_index: (course.chapters?.length || 0) + 1 });
        setIsChapterModalOpen(true);
    };

    const openEditChapterModal = (chapter) => {
        setEditingChapter(chapter);
        setChapterForm({ chapter_name: chapter.chapter_name, order_index: chapter.order_index });
        setIsChapterModalOpen(true);
    };

    const handleSubmitChapter = async (e) => {
        e.preventDefault();
        try {
            if (editingChapter) {
                await api.put(`/courses/${id}/chapters/${editingChapter.id}`, chapterForm);
            } else {
                await api.post(`/courses/${id}/chapters`, chapterForm);
            }
            setIsChapterModalOpen(false);
            fetchCourseDetail();
            toast.success(editingChapter ? 'Cập nhật chương thành công' : 'Thêm chương thành công');
        } catch (error) {
            console.error('Chapter error:', error.response || error);
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteChapter = async (chapterId) => {
        if (!window.confirm('Xóa chương này sẽ xóa toàn bộ bài học bên trong. Bạn có chắc không?')) return;
        try {
            await api.delete(`/courses/${id}/chapters/${chapterId}`);
            fetchCourseDetail();
            toast.success('Xóa chương thành công');
        } catch (error) {
            toast.error('Lỗi xóa chương: ' + (error.response?.data?.message || error.message));
        }
    };

    // --- LESSON LOGIC ---
    const openAddLessonModal = (chapterId) => {
        setEditingLesson(null);
        setSelectedChapterId(chapterId);
        setLessonForm({ lesson_name: '', content_type: 'VIDEO', file_path: '', file: null });
        setIsLessonModalOpen(true);
    };

    const openEditLessonModal = (chapterId, lesson) => {
        setEditingLesson(lesson);
        setSelectedChapterId(chapterId);
        setLessonForm({ lesson_name: lesson.lesson_name, content_type: lesson.content_type, file_path: lesson.file_path || '', file: null });
        setIsLessonModalOpen(true);
    };

    const handleSubmitLesson = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('lesson_name', lessonForm.lesson_name);
            formData.append('content_type', lessonForm.content_type);
            
            if (lessonForm.content_type === 'PDF' && lessonForm.file) {
                formData.append('file', lessonForm.file);
            } else if (lessonForm.content_type === 'VIDEO') {
                formData.append('file_path', lessonForm.file_path);
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editingLesson) {
                await api.put(`/courses/${id}/chapters/${selectedChapterId}/lessons/${editingLesson.id}`, formData, config);
            } else {
                await api.post(`/courses/${id}/chapters/${selectedChapterId}/lessons`, formData, config);
            }
            setIsLessonModalOpen(false);
            fetchCourseDetail();
            toast.success(editingLesson ? 'Cập nhật bài học thành công' : 'Thêm bài học thành công');
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteLesson = async (chapterId, lessonId) => {
        if (!window.confirm('Xóa bài học này?')) return;
        try {
            await api.delete(`/courses/${id}/chapters/${chapterId}/lessons/${lessonId}`);
            fetchCourseDetail();
            toast.success('Xóa bài học thành công');
        } catch (error) {
            toast.error('Lỗi xóa bài học');
        }
    };

    if (loading) return (
        <div className="course-detail-container" style={{ padding: '1rem 0' }}>
            <SkeletonTable rows={5} columns={2} />
        </div>
    );
    if (error) return <ErrorState message={error} onRetry={fetchData} />;
    if (!course) return <ErrorState message="Không tìm thấy khóa học." />;

    return (
        <div className="course-detail-container" style={{ padding: '1rem 0' }}>
            <Breadcrumb items={[
                { label: 'Khóa học', to: '/admin/courses' },
                { label: course.course_name }
            ]} />
            <div className="course-detail-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/admin/courses')} className="btn-secondary" style={{ padding: '8px', display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '8px', color: 'white' }}>
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Nội dung khóa: <span style={{ color: 'var(--fpt-orange)' }}>{course.course_name}</span></h2>
                <button className="btn-primary" style={{ marginLeft: 'auto', width: 'fit-content', padding: '0.6rem 1.2rem', borderRadius: '8px' }} onClick={openAddChapterModal}>
                    <Plus size={18} /> Thêm Chương
                </button>
            </div>

            {/* --- COURSE PERMISSIONS SECTION --- */}
            <div className="permissions-section" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={18} /> Phân quyền phòng ban
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}>Chỉ những phòng ban được cấp quyền dưới đây mới có thể thấy và học khóa học này.</p>
                
                <form onSubmit={handleAddPermission} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <select className="form-control" value={selectedDepartmentId} onChange={e => setSelectedDepartmentId(e.target.value)} style={{ width: '100%', borderRadius: '8px', padding: '0.7rem 1rem', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: 'white', fontWeight: '500' }}>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.department_name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ width: '160px' }}>
                        <select className="form-control" value={accessLevel} onChange={e => setAccessLevel(e.target.value)} style={{ width: '100%', borderRadius: '8px', padding: '0.7rem 1rem', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: 'white', fontWeight: '500' }}>
                            <option value="RESTRICTED">Bắt buộc học</option>
                            <option value="OPTIONAL">Tùy chọn</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: 'fit-content', padding: '0.7rem 1.5rem', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                        <Plus size={16} strokeWidth={3} /> Thêm Quyền
                    </button>
                </form>

                <div className="permissions-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {course.permissions?.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>Chưa có phòng ban nào được cấp quyền.</span>}
                    {course.permissions?.map(perm => (
                        <div key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', fontSize: '0.85rem', transition: 'all 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.backgroundColor='rgba(255, 255, 255, 0.2)'} onMouseOut={e => e.currentTarget.style.backgroundColor='rgba(255, 255, 255, 0.1)'}>
                            <Building size={14} color="#94a3b8" />
                            <span style={{ fontWeight: '600', color: 'white' }}>{perm.department_name}</span>
                            <span style={{ color: '#cbd5e1', fontSize: '0.75rem', fontWeight: '600', padding: '2px 8px', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>{perm.access_level}</span>
                            <button type="button" onClick={() => handleRemovePermission(perm.department_id)} style={{ border: 'none', background: 'rgba(239, 68, 68, 0.2)', cursor: 'pointer', color: '#f87171', display: 'flex', padding: '4px', borderRadius: '50%', marginLeft: '4px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(239, 68, 68, 0.4)'} onMouseOut={e => e.currentTarget.style.background='rgba(239, 68, 68, 0.2)'}>
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chapters-list">
                {course.chapters?.length === 0 && <div style={{ color: '#94a3b8', fontSize: '1rem', textAlign: 'center', marginTop: '3rem' }}>Chưa có chương nào trong khóa học này.</div>}

                {course.chapters?.map(chapter => (
                    <div key={chapter.id} className="chapter-card" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="chapter-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>{chapter.chapter_name}</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => openAddLessonModal(chapter.id)} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', display: 'flex', gap: '6px', alignItems: 'center', background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '6px', color: 'white', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255, 255, 255, 0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255, 255, 255, 0.1)'}><Plus size={14} /> Bài học</button>
                                <button className="btn-primary" onClick={() => navigate(`/admin/chapters/${chapter.id}/quiz`)} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', display: 'flex', gap: '6px', alignItems: 'center', width: 'fit-content', borderRadius: '6px', background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)' }}><FileText size={14} /> Soạn Quiz</button>
                                <button className="btn-yellow" onClick={() => openEditChapterModal(chapter)} style={{ padding: '0.4rem 0.6rem', borderRadius: '6px' }}><Edit size={14} /></button>
                                <button className="btn-red" onClick={() => handleDeleteChapter(chapter.id)} style={{ padding: '0.4rem 0.6rem', borderRadius: '6px' }}><Trash2 size={14} /></button>
                            </div>
                        </div>

                        <div className="lessons-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {chapter.lessons?.length === 0 && <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Chưa có bài học nào.</div>}
                            {chapter.lessons?.map(lesson => (
                                <div key={lesson.id} className="lesson-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {lesson.content_type === 'VIDEO' ? <Video size={18} color="#cbd5e1" /> : <FileText size={18} color="#cbd5e1" />}
                                        <span style={{ fontWeight: '500', color: 'white', fontSize: '0.95rem' }}>{lesson.lesson_name}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn-yellow" style={{ padding: '6px', borderRadius: '6px' }} onClick={() => openEditLessonModal(chapter.id, lesson)}><Edit size={14} /></button>
                                        <button className="btn-red" style={{ padding: '6px', borderRadius: '6px' }} onClick={() => handleDeleteLesson(chapter.id, lesson.id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Thêm/Sửa Chương */}
            {isChapterModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingChapter ? 'Sửa Chương' : 'Thêm Chương mới'}</h3>
                            <button className="modal-close-btn" type="button" onClick={() => setIsChapterModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmitChapter}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Tên chương</label>
                                    <input type="text" className="form-control" required
                                        value={chapterForm.chapter_name} onChange={e => setChapterForm({ ...chapterForm, chapter_name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Thứ tự hiển thị (Order)</label>
                                    <input type="number" className="form-control" required min="1"
                                        value={chapterForm.order_index} onChange={e => setChapterForm({ ...chapterForm, order_index: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsChapterModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary create-btn">{editingChapter ? 'Cập nhật' : 'Lưu Chương'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Thêm/Sửa Bài học */}
            {isLessonModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingLesson ? 'Sửa Bài học' : 'Thêm Bài học mới'}</h3>
                            <button className="modal-close-btn" type="button" onClick={() => setIsLessonModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmitLesson}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Tên bài học</label>
                                    <input type="text" className="form-control" required
                                        value={lessonForm.lesson_name} onChange={e => setLessonForm({ ...lessonForm, lesson_name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Loại nội dung</label>
                                    <select className="form-control" value={lessonForm.content_type} onChange={e => setLessonForm({ ...lessonForm, content_type: e.target.value })}>
                                        <option value="VIDEO">Video</option>
                                        <option value="PDF">Tài liệu (PDF, Word)</option>
                                    </select>
                                </div>
                                
                                {lessonForm.content_type === 'VIDEO' && (
                                    <div className="form-group">
                                        <label>Đường dẫn Video (URL Youtube)</label>
                                        <input type="text" className="form-control" required
                                            placeholder="VD: https://youtube.com/..."
                                            value={lessonForm.file_path} onChange={e => setLessonForm({ ...lessonForm, file_path: e.target.value })} />
                                    </div>
                                )}

                                {lessonForm.content_type === 'PDF' && (
                                    <div className="form-group">
                                        <label>Tải file lên (PDF)</label>
                                        <input type="file" className="form-control" accept=".pdf"
                                            onChange={e => setLessonForm({ ...lessonForm, file: e.target.files[0] })} />
                                        {editingLesson && editingLesson.file_path && (
                                            <small style={{display: 'block', marginTop: '5px', color: '#94a3b8'}}>Đã có file đính kèm. Chọn file mới để thay thế.</small>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsLessonModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary create-btn">{editingLesson ? 'Cập nhật' : 'Lưu Bài học'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
