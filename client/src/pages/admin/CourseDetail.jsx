import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Video, FileText, X, Edit, Building, Shield } from 'lucide-react';
import api from '../../utils/api';

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // States for Modals
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedChapterId, setSelectedChapterId] = useState(null);

    // Editing states
    const [editingChapter, setEditingChapter] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);

    const [chapterForm, setChapterForm] = useState({ chapter_name: '', order_index: 1 });
    const [lessonForm, setLessonForm] = useState({ lesson_name: '', content_type: 'VIDEO', file_path: '' });

    // Permission states
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [accessLevel, setAccessLevel] = useState('RESTRICTED');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [courseRes, deptsRes] = await Promise.all([
                api.get(`/courses/${id}`),
                api.get('/departments')
            ]);
            setCourse(courseRes.data);
            setDepartments(deptsRes.data);
            if (deptsRes.data.length > 0) setSelectedDepartmentId(deptsRes.data[0].id);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
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
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRemovePermission = async (departmentId) => {
        if (!window.confirm('Xóa quyền của phòng ban này?')) return;
        try {
            await api.delete(`/courses/${id}/permissions/${departmentId}`);
            fetchCourseDetail();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
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
        } catch (error) {
            console.error('Chapter error:', error.response || error);
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteChapter = async (chapterId) => {
        if (!window.confirm('Xóa chương này sẽ xóa toàn bộ bài học bên trong. Bạn có chắc không?')) return;
        try {
            await api.delete(`/courses/${id}/chapters/${chapterId}`);
            fetchCourseDetail();
        } catch (error) {
            alert('Lỗi xóa chương');
        }
    };

    // --- LESSON LOGIC ---
    const openAddLessonModal = (chapterId) => {
        setEditingLesson(null);
        setSelectedChapterId(chapterId);
        setLessonForm({ lesson_name: '', content_type: 'VIDEO', file_path: '' });
        setIsLessonModalOpen(true);
    };

    const openEditLessonModal = (chapterId, lesson) => {
        setEditingLesson(lesson);
        setSelectedChapterId(chapterId);
        setLessonForm({ lesson_name: lesson.lesson_name, content_type: lesson.content_type, file_path: lesson.file_path || '' });
        setIsLessonModalOpen(true);
    };

    const handleSubmitLesson = async (e) => {
        e.preventDefault();
        try {
            if (editingLesson) {
                await api.put(`/courses/${id}/chapters/${selectedChapterId}/lessons/${editingLesson.id}`, lessonForm);
            } else {
                await api.post(`/courses/${id}/chapters/${selectedChapterId}/lessons`, lessonForm);
            }
            setIsLessonModalOpen(false);
            fetchCourseDetail();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteLesson = async (chapterId, lessonId) => {
        if (!window.confirm('Xóa bài học này?')) return;
        try {
            await api.delete(`/courses/${id}/chapters/${chapterId}/lessons/${lessonId}`);
            fetchCourseDetail();
        } catch (error) {
            alert('Lỗi xóa bài học');
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (!course) return <div>Không tìm thấy khóa học</div>;

    return (
        <div className="course-detail-container" style={{ padding: '1rem 0' }}>
            <div className="course-detail-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/admin/courses')} className="btn-secondary" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ color: 'var(--fpt-blue)', margin: 0, fontSize: '1.25rem' }}>Nội dung khóa: {course.course_name}</h2>
                <button className="btn-primary create-btn" style={{ marginLeft: 'auto' }} onClick={openAddChapterModal}>
                    <Plus size={18} /> Thêm Chương
                </button>
            </div>

            {/* --- COURSE PERMISSIONS SECTION --- */}
            <div className="permissions-section" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--fpt-blue)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={18} /> Phân quyền phòng ban
                </h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1rem' }}>Chỉ những phòng ban được cấp quyền dưới đây mới có thể thấy và học khóa học này.</p>
                
                <form onSubmit={handleAddPermission} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <select className="form-control" value={selectedDepartmentId} onChange={e => setSelectedDepartmentId(e.target.value)} style={{ width: '250px' }}>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.department_name}</option>
                        ))}
                    </select>
                    <select className="form-control" value={accessLevel} onChange={e => setAccessLevel(e.target.value)} style={{ width: '150px' }}>
                        <option value="RESTRICTED">Bắt buộc học</option>
                        <option value="OPTIONAL">Tùy chọn</option>
                    </select>
                    <button type="submit" className="btn-primary">Thêm Quyền</button>
                </form>

                <div className="permissions-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {course.permissions?.length === 0 && <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Chưa có phòng ban nào được cấp quyền.</span>}
                    {course.permissions?.map(perm => (
                        <div key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#F3F4F6', borderRadius: '20px', fontSize: '0.9rem' }}>
                            <Building size={14} color="#4B5563" />
                            <span style={{ fontWeight: '500', color: '#1F2937' }}>{perm.department_name}</span>
                            <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>({perm.access_level})</span>
                            <button type="button" onClick={() => handleRemovePermission(perm.department_id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444', display: 'flex', padding: '2px' }}>
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chapters-list">
                {course.chapters?.length === 0 && <div style={{ color: '#9CA3AF', fontSize: '1rem', textAlign: 'center', marginTop: '3rem' }}>Chưa có chương nào trong khóa học này.</div>}

                {course.chapters?.map(chapter => (
                    <div key={chapter.id} className="chapter-card" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <div className="chapter-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--fpt-blue)', fontSize: '1.1rem' }}>{chapter.chapter_name}</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn-secondary" onClick={() => openAddLessonModal(chapter.id)} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', display: 'flex', gap: '4px', alignItems: 'center' }}><Plus size={14} /> Bài học</button>
                                <button className="btn-primary" onClick={() => navigate(`/admin/chapters/${chapter.id}/quiz`)} style={{ backgroundColor: 'var(--fpt-orange)', fontSize: '0.85rem', padding: '0.4rem 0.8rem', display: 'flex', gap: '4px', alignItems: 'center' }}>📝 Soạn Quiz</button>
                                <button className="btn-yellow" onClick={() => openEditChapterModal(chapter)} style={{ padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}><Edit size={14} /> Sửa</button>
                                <button className="btn-red" onClick={() => handleDeleteChapter(chapter.id)} style={{ padding: '0.4rem' }}><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="lessons-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {chapter.lessons?.length === 0 && <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Chưa có bài học nào.</div>}
                            {chapter.lessons?.map(lesson => (
                                <div key={lesson.id} className="lesson-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {lesson.content_type === 'VIDEO' ? <Video size={18} color="#9CA3AF" /> : <FileText size={18} color="#9CA3AF" />}
                                        <span style={{ fontWeight: '500', color: '#4B5563', fontSize: '0.95rem' }}>{lesson.lesson_name}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button className="btn-yellow" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => openEditLessonModal(chapter.id, lesson)}><Edit size={14} /></button>
                                        <button className="btn-red" style={{ padding: '4px 6px', background: 'transparent', color: '#EF4444' }} onClick={() => handleDeleteLesson(chapter.id, lesson.id)}><Trash2 size={16} /></button>
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
                                        <option value="DOCUMENT">Tài liệu (PDF, Word)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Đường dẫn file (URL)</label>
                                    <input type="text" className="form-control" required
                                        placeholder="VD: https://youtube.com/..."
                                        value={lessonForm.file_path} onChange={e => setLessonForm({ ...lessonForm, file_path: e.target.value })} />
                                </div>
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
