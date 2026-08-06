import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [editingDept, setEditingDept] = useState(null);
    const [deptToDelete, setDeptToDelete] = useState(null);
    
    const [formData, setFormData] = useState({ department_name: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingDept(null);
        setFormData({ department_name: '' });
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (dept) => {
        setEditingDept(dept);
        setFormData({ department_name: dept.department_name });
        setError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingDept) {
                await api.put(`/departments/${editingDept.id}`, formData);
            } else {
                await api.post('/departments', formData);
            }
            setIsModalOpen(false);
            fetchDepartments();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    const openDeleteModal = (dept) => {
        setDeptToDelete(dept);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/departments/${deptToDelete.id}`);
            setIsDeleteModalOpen(false);
            setDeptToDelete(null);
            fetchDepartments();
        } catch (err) {
            alert(err.response?.data?.message || 'Không thể xóa phòng ban này.');
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="course-list-container">
            <div className="course-list-header">
                <h2>Quản lý Phòng ban</h2>
                <div className="course-actions">
                    <div className="search-bar-container">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Tìm kiếm phòng ban..." />
                    </div>
                    <button className="btn-primary create-btn" onClick={openCreateModal}>
                        <Plus size={18} /> Thêm phòng ban
                    </button>
                </div>
            </div>

            <div className="course-list-body">
                <div className="course-list-labels" style={{ gridTemplateColumns: '1fr 3fr 1fr' }}>
                    <span className="label-course">Mã ID</span>
                    <span className="label-progress">Tên phòng ban</span>
                    <span className="label-status">Thao tác</span>
                </div>

                {departments.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        Chưa có phòng ban nào.
                    </div>
                )}

                {departments.map(dept => (
                    <div key={dept.id} className="course-row-card" style={{ gridTemplateColumns: '1fr 3fr 1fr' }}>
                        <div className="course-info">
                            <span style={{ fontWeight: 'bold', color: '#9CA3AF' }}>#{dept.id}</span>
                        </div>
                        
                        <div className="course-stats">
                            <span className="course-title" style={{ fontSize: '1.05rem', color: 'var(--fpt-blue)' }}>
                                {dept.department_name}
                            </span>
                        </div>

                        <div className="course-status-actions">
                            <button className="btn-yellow" title="Sửa" onClick={() => openEditModal(dept)}>
                                <Edit size={16} /> Sửa
                            </button>
                            <button className="btn-red" title="Xóa" onClick={() => openDeleteModal(dept)}>
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
                            <h3>{editingDept ? 'Chỉnh sửa Phòng ban' : 'Thêm Phòng ban Mới'}</h3>
                            <button className="modal-close-btn" type="button" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                                
                                <div className="form-group">
                                    <label>Tên phòng ban</label>
                                    <input type="text" className="form-control" required 
                                        value={formData.department_name} onChange={(e) => setFormData({...formData, department_name: e.target.value})} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary create-btn">
                                    {editingDept ? 'Cập nhật' : 'Tạo mới'}
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
                                Bạn có chắc chắn muốn xóa phòng ban <strong>{deptToDelete?.department_name}</strong> không?
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
