import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, AlertCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { SkeletonTable } from '../../components/SkeletonCard';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 10;

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣ 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛
    return str;
}

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('ALL');
    
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        department_id: '',
        rank: 'Junior'
    });
    const [formError, setFormError] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [empRes, deptRes] = await Promise.all([
                api.get('/employees'),
                api.get('/departments')
            ]);
            setEmployees(empRes.data);
            setDepartments(deptRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối và thử lại.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditingEmployee(null);
        setFormData({ 
            email: '', password: '', full_name: '', 
            department_id: departments[0]?.id || '', 
            rank: 'Junior' 
        });
        setFormError('');
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
        setFormError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            if (editingEmployee) {
                await api.put(`/employees/${editingEmployee.id}`, {
                    full_name: formData.full_name,
                    department_id: formData.department_id,
                    rank: formData.rank,
                    password: formData.password || undefined
                });
            } else {
                await api.post('/employees', formData);
            }
            setIsModalOpen(false);
            fetchData();
            toast.success(editingEmployee ? 'Cập nhật thành công!' : 'Thêm nhân viên thành công!');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
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
            toast.success('Đã xóa nhân viên thành công!');
        } catch (error) {
            toast.error('Không thể xóa nhân viên này.');
        }
    };

    if (loading) return (
        <div className="course-list-container">
            <div className="course-list-header"><h2>Quản lý Nhân viên</h2></div>
            <div className="course-list-body"><SkeletonTable rows={6} columns={4} /></div>
        </div>
    );

    if (error) return (
        <div className="course-list-container">
            <div className="course-list-header"><h2>Quản lý Nhân viên</h2></div>
            <ErrorState message={error} onRetry={fetchData} />
        </div>
    );

    // Lọc dữ liệu an toàn
    const filteredEmployees = employees.filter(emp => {
        const name = (emp.full_name || '').toLowerCase();
        const email = (emp.email || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        const matchSearch = name.includes(searchLower) || email.includes(searchLower);
        const matchDept = filterDept === 'ALL' || emp.department_id === Number(filterDept);
        return matchSearch && matchDept;
    });

    // Phân trang
    const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
    const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
    const handleDeptChange = (e) => { setFilterDept(e.target.value); setCurrentPage(1); };

    return (
        <div className="course-list-container">
            <div className="course-list-header">
                <h2>Quản lý Nhân viên</h2>
                <div className="course-actions">
                    <div className="search-bar-container">
                        <Search size={18} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm nhân viên..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <select 
                        className="form-control" 
                        style={{ width: 'auto', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(30, 41, 59, 0.7)', color: 'white' }}
                        value={filterDept}
                        onChange={handleDeptChange}
                    >
                        <option value="ALL">Tất cả phòng ban</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.department_name}</option>
                        ))}
                    </select>
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

                {paginatedEmployees.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title={searchTerm || filterDept !== 'ALL' ? 'Không tìm thấy kết quả' : 'Chưa có nhân viên nào'}
                        description={searchTerm || filterDept !== 'ALL' ? 'Thử thay đổi từ khóa hoặc phòng ban.' : 'Hãy thêm nhân viên đầu tiên!'}
                        actionText={!searchTerm && filterDept === 'ALL' ? '+ Thêm nhân viên' : undefined}
                        onAction={!searchTerm && filterDept === 'ALL' ? openCreateModal : undefined}
                    />
                ) : (
                    paginatedEmployees.map(emp => (
                    <div key={emp.id} className="course-row-card" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr' }}>
                        <div className="course-info">
                            <div className="course-thumbnail" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'transparent' }}>
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.full_name)}&background=random`} alt="avatar" style={{ borderRadius: '50%' }} />
                            </div>
                            <div>
                                <div className="course-title" style={{ fontSize: '1.05rem', color: 'white' }}>{emp.full_name}</div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{emp.email}</div>
                            </div>
                        </div>
                        
                        <div className="course-stats">
                            <span className="course-type-badge" style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                {emp.department_name || 'Chưa phân ban'}
                            </span>
                        </div>

                        <div className="course-stats">
                            <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#cbd5e1' }}>
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
                    ))
                )}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
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
                                {formError && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{formError}</div>}
                                
                                <div className="form-group">
                                    <label>Họ và tên</label>
                                    <input type="text" className="form-control" required 
                                        value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                                </div>
                                
                                <div className="form-group">
                                    <label>Email đăng nhập</label>
                                    <input type="email" className="form-control" required disabled={!!editingEmployee}
                                        value={formData.email} onChange={(e) => {
                                            let cleanEmail = removeVietnameseTones(e.target.value).toLowerCase().replace(/\s+/g, '.');
                                            setFormData({...formData, email: cleanEmail});
                                        }} />
                                </div>

                                <div className="form-group">
                                    <label>{editingEmployee ? 'Mật khẩu mới (Để trống nếu không đổi)' : 'Mật khẩu'}</label>
                                    <input type="password" className="form-control" 
                                        required={!editingEmployee} 
                                        autoComplete="new-password"
                                        minLength={editingEmployee && !formData.password ? undefined : 6}
                                        value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                </div>
                                
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
