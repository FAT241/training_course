import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, AlertCircle, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { SkeletonTable } from '../../components/SkeletonCard';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    
    const [editingDept, setEditingDept] = useState(null);
    const [deptToDelete, setDeptToDelete] = useState(null);
    
    const [formData, setFormData] = useState({ department_name: '' });

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/departments');
            setDepartments(response.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const openCreateModal = () => {
        setEditingDept(null);
        setFormData({ department_name: '' });
        setFormError('');
        setIsModalOpen(true);
    };

    const openEditModal = (dept) => {
        setEditingDept(dept);
        setFormData({ department_name: dept.department_name });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            if (editingDept) {
                await api.put(`/departments/${editingDept.id}`, formData);
            } else {
                await api.post('/departments', formData);
            }
            setIsModalOpen(false);
            fetchDepartments();
            toast.success(editingDept ? 'Cập nhật thành công!' : 'Thêm phòng ban thành công!');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
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
            toast.success('Xóa phòng ban thành công!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Không thể xóa phòng ban này.');
        }
    };

    if (loading) return (
        <div className="course-list-container">
            <div className="course-list-header"><h2>Quản lý Phòng ban</h2></div>
            <div className="course-list-body"><SkeletonTable rows={5} columns={3} /></div>
        </div>
    );

    if (error) return (
        <div className="course-list-container">
            <div className="course-list-header"><h2>Quản lý Phòng ban</h2></div>
            <ErrorState message={error} onRetry={fetchDepartments} />
        </div>
    );

    // Lọc dữ liệu an toàn
    const filteredDepartments = departments.filter(dept => 
        (dept.department_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="course-list-container">
            <div className="course-list-header">
                <h2>Quản lý Phòng ban</h2>
                <div className="course-actions">
                    <div className="search-bar-container">
                        <Search size={18} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm phòng ban..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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

                {filteredDepartments.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title={searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có phòng ban nào'}
                        description={searchTerm ? 'Thử thay đổi từ khóa.' : 'Hãy tạo phòng ban đầu tiên!'}
                        actionText={!searchTerm ? '+ Thêm phòng ban' : undefined}
                        onAction={!searchTerm ? openCreateModal : undefined}
                    />
                ) : (
                    filteredDepartments.map(dept => (
                    <div key={dept.id} className="course-row-card" style={{ gridTemplateColumns: '1fr 3fr 1fr' }}>
                        <div className="course-info">
                            <span style={{ fontWeight: 'bold', color: '#94a3b8' }}>#{dept.id}</span>
                        </div>
                        
                        <div className="course-stats">
                            <span className="course-title" style={{ fontSize: '1.05rem', color: 'white' }}>
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
                    ))
                )}
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
                                {error && <div style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                                
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
