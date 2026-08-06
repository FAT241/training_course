import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        department_id: '',
        rank: 'Junior'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [empRes, deptRes] = await Promise.all([
                api.get('/employees'),
                api.get('/departments')
            ]);
            setEmployees(empRes.data);
            setDepartments(deptRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingEmployee(null);
        setFormData({ 
            email: '', password: '', full_name: '', 
            department_id: departments[0]?.id || '', 
            rank: 'Junior' 
        });
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (emp) => {
        setEditingEmployee(emp);
        setFormData({
            email: emp.email,
            password: '', 
            full_name: emp.full_name,
            department_id: emp.department_id || '',
            rank: emp.rank || 'Junior'
        });
        setError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingEmployee) {
                await api.put(`/employees/${editingEmployee.id}`, {
                    full_name: formData.full_name,
                    department_id: formData.department_id,
                    rank: formData.rank
                });
            } else {
                await api.post('/employees', formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    const openDeleteModal = (emp) => {
        setEmployeeToDelete(emp);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/employees/${employeeToDelete.id}`);
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
            fetchData();
        } catch (err) {
            alert('Không thể xóa nhân viên này.');
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="course-list-container">
            <div className="course-list-header">
                <h2>Quản lý Nhân viên</h2>
                <div className="course-actions">
                    <div className="search-bar-container">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Tìm kiếm nhân viên..." />
                    </div>
                    <button className="btn-primary create-btn" onClick={openCreateModal}>
                        <Plus size={18} /> Thêm nhân viên
                    </button>
                </div>
            </div>

            <div className="course-list-body">
                <div className="course-list-labels" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr' }}>
                    <span className="label-course">Nhân viên</span>
                    <span className="label-progress">Phòng ban</span>
                    <span className="label-progress">Cấp bậc</span>
                    <span className="label-status">Thao tác</span>
                </div>

                {employees.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        Chưa có nhân viên nào.
                    </div>
                )}

                {employees.map(emp => (
                    <div key={emp.id} className="course-row-card" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr' }}>
                        <div className="course-info">
                            <div className="course-thumbnail" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'transparent' }}>
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.full_name)}&background=random`} alt="avatar" style={{ borderRadius: '50%' }} />
                            </div>
                            <div>
                                <div className="course-title" style={{ fontSize: '1.05rem' }}>{emp.full_name}</div>
                                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{emp.email}</div>
                            </div>
                        </div>
                        
                        <div className="course-stats">
                            <span className="course-type-badge" style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }}>
                                {emp.department_name || 'Chưa phân ban'}
                            </span>
                        </div>

                        <div className="course-stats">
                            <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#4B5563' }}>
                                {emp.rank || 'N/A'}
                            </span>
                        </div>

                        <div className="course-status-actions">
                            <button className="btn-yellow" title="Sửa" onClick={() => openEditModal(emp)}>
                                <Edit size={16} /> Sửa
                            </button>
                            <button className="btn-red" title="Xóa" onClick={() => openDeleteModal(emp)}>
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
                            <h3>{editingEmployee ? 'Chỉnh sửa Nhân viên' : 'Thêm Nhân viên Mới'}</h3>
                            <button className="modal-close-btn" type="button" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                                
                                <div className="form-group">
                                    <label>Họ và tên</label>
                                    <input type="text" className="form-control" required 
                                        value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                                </div>
                                
                                <div className="form-group">
                                    <label>Email đăng nhập</label>
                                    <input type="email" className="form-control" required disabled={!!editingEmployee}
                                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                </div>

                                {!editingEmployee && (
                                    <div className="form-group">
                                        <label>Mật khẩu</label>
                                        <input type="password" className="form-control" required minLength="6"
                                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                    </div>
                                )}
                                
                                <div className="form-group">
                                    <label>Phòng ban</label>
                                    <select className="form-control" value={formData.department_id} required
                                        onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
                                        <option value="">Chọn phòng ban</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.department_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Cấp bậc (Rank)</label>
                                    <select className="form-control" value={formData.rank}
                                        onChange={(e) => setFormData({...formData, rank: e.target.value})}>
                                        <option value="Intern">Intern</option>
                                        <option value="Fresher">Fresher</option>
                                        <option value="Junior">Junior</option>
                                        <option value="Middle">Middle</option>
                                        <option value="Senior">Senior</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary create-btn">
                                    {editingEmployee ? 'Cập nhật' : 'Tạo tài khoản'}
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
                                Bạn có chắc chắn muốn xóa nhân viên <strong>{employeeToDelete?.full_name}</strong> không? Toàn bộ dữ liệu học tập của nhân viên này sẽ bị xóa.
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
