import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Users, Building, LogOut, BookA, Menu, X } from 'lucide-react';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Trạng thái đóng/mở Drawer

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'ADMIN') {
            navigate('/dashboard'); 
            return;
        }
        setUser(parsedUser);
    }, [navigate]);

    // Tự động đóng menu khi chuyển trang
    useEffect(() => {
        setIsDrawerOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/admin/courses')) return 'Quản lý Khóa học';
        if (path.includes('/admin/employees')) return 'Quản lý Nhân viên';
        if (path.includes('/admin/departments')) return 'Quản lý Phòng ban';
        return 'Tổng quan Hệ thống';
    };

    if (!user) return null;

    return (
        <div className="admin-layout">
            {/* Thanh Header phía trên cùng */}
            <header className="admin-topbar">
                <div className="topbar-left">
                    <button className="hamburger-btn" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                        <Menu size={24} />
                    </button>
                    <div className="topbar-logo">
                        <div className="topbar-icon"><BookOpen size={20} /></div>
                        <span className="topbar-title">FPT Training</span>
                    </div>
                </div>

                <div className="topbar-center">
                    <h1 className="header-title">{getPageTitle()}</h1>
                </div>

                <div className="topbar-right">
                    <div className="user-info text-right">
                        <span className="user-name">{user?.fullName}</span>
                        <span className="user-role">Quản trị viên</span>
                    </div>
                    <div className="user-avatar">
                        {user?.fullName?.charAt(0)}
                    </div>
                </div>
            </header>

            {/* Khu vực chứa Nội dung và Drawer Sidebar */}
            <div className="admin-body-container">
                {/* Lớp phủ mờ (Overlay) khi mở menu */}
                {isDrawerOpen && (
                    <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}></div>
                )}

                {/* Sidebar Ngăn kéo */}
                <aside className={`admin-drawer ${isDrawerOpen ? 'open' : ''}`}>
                    <div className="drawer-header">
                        <span>Menu Quản Trị</span>
                        <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    
                    <nav className="sidebar-nav">
                        <NavLink to="/admin" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <LayoutDashboard size={20} /> Tổng quan
                        </NavLink>
                        <NavLink to="/admin/courses" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <BookA size={20} /> Khóa học
                        </NavLink>
                        <NavLink to="/admin/employees" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <Users size={20} /> Nhân viên
                        </NavLink>
                        <NavLink to="/admin/departments" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <Building size={20} /> Phòng ban
                        </NavLink>
                    </nav>

                    <div className="sidebar-footer">
                        <button onClick={handleLogout} className="logout-btn">
                            <LogOut size={20} /> Đăng xuất
                        </button>
                    </div>
                </aside>

                {/* Khu vực nội dung chính */}
                <main className="admin-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
