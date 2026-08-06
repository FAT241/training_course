import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Data States
    const [editingCourse, setEditingCourse] = useState(null);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [formData, setFormData] = useState({
        course_name: '',
        description: '',
        course_type: 'MANDATORY'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        }
    };

    // Mở modal tạo mới
    const openCreateModal = () => {
        setEditingCourse(null);
        setFormData({ course_name: '', description: '', course_type: 'MANDATORY' });
        setError('');
        setIsModalOpen(true);
    };

    // Mở modal sửa
    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({
            course_name: course.course_name,
            description: course.description,
            course_type: course.course_type
        });
        setError('');
        setIsModalOpen(true);
    };

    // Xử lý Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingCourse) {
                // Call API Update
                await api.put(`/courses/${editingCourse.id}`, formData);
            } else {
                // Call API Create
                await api.post('/courses', formData);
            }
            setIsModalOpen(false);
            fetchCourses(); // Tải lại danh sách
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    // Mở modal xóa
    const openDeleteModal = (course) => {
        setCourseToDelete(course);
        setIsDeleteModalOpen(true);
    };

    // Xác nhận xóa
    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/courses/${courseToDelete.id}`);
            setIsDeleteModalOpen(false);
            setCourseToDelete(null);
            fetchCourses();
        } catch (err) {
            console.error('Lỗi xóa khóa học:', err);
            alert('Không thể xóa khóa học này.');
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="course-list-container">
            <div className="course-list-header">
                <h2>Tất cả khóa học</h2>
                <div className="course-actions">
                    <div className="search-bar-container">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Tìm kiếm..." />
                    </div>
                    <button className="filter-btn">
                        <Filter size={18} />
                    </button>
                    <button className="btn-primary create-btn" onClick={openCreateModal}>
                        <Plus size={18} /> Tạo mới
                    </button>
                </div>
            </div>

            <div className="course-list-body">
                <div className="course-list-labels">
                    <span className="label-course">Khóa học</span>
                    <span className="label-progress">Loại khóa học</span>
                    <span className="label-status">Thao tác</span>
                </div>

                {courses.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        Chưa có khóa học nào.
                    </div>
                )}

                {courses.map(course => (
                    <div key={course.id} className="course-row-card">
                        <div className="course-info">
                            <div className="course-thumbnail">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.course_name)}&background=random`} alt="thumbnail" />
                            </div>
                            <span className="course-title">{course.course_name}</span>
                        </div>
                        
                        <div className="course-stats">
                            <span className="course-type-badge">
                                {course.course_type === 'MANDATORY' ? 'Bắt buộc' : 'Tùy chọn'}
                            </span>
                        </div>

                        <div className="course-status-actions">
                            <button className="btn-yellow" title="Sửa" onClick={() => openEditModal(course)}>
                                <Edit size={16} /> Sửa
                            </button>
                            <button className="btn-green" title="Xem" onClick={() => navigate(`/admin/courses/${course.id}`)}>
                                <Eye size={16} /> Xem
                            </button>
                            <button className="btn-red" title="Xóa" onClick={() => openDeleteModal(course)}>
                                <Trash2 size={16} /> Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Thêm/Sửa */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingCourse ? 'Chỉnh sửa Khóa học' : 'Tạo Khóa học Mới'}</h3>
                            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                                
                                <div className="form-group">
                                    <label>Tên khóa học</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Nhập tên khóa học" 
                                        required 
                                        value={formData.course_name}
                                        onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Mô tả khóa học</label>
                                    <textarea 
                                        className="form-control" 
                                        placeholder="Nhập mô tả..." 
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>
                                
                                <div className="form-group">
                                    <label>Loại khóa học</label>
                                    <select 
                                        className="form-control"
                                        value={formData.course_type}
                                        onChange={(e) => setFormData({...formData, course_type: e.target.value})}
                                    >
                                        <option value="MANDATORY">Bắt buộc</option>
                                        <option value="OPTIONAL">Tùy chọn</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary create-btn">
                                    {editingCourse ? 'Cập nhật' : 'Lưu khóa học'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Xác nhận Xóa */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                            <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem', color: '#1F2937', fontSize: '1.25rem', fontWeight: 'bold' }}>Xác nhận xóa</h3>
                            <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                                Bạn có chắc chắn muốn xóa khóa học <strong>{courseToDelete?.course_name}</strong> không? Hành động này không thể hoàn tác.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Hủy</button>
                                <button type="button" className="btn-red" onClick={handleDeleteConfirm}>
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
