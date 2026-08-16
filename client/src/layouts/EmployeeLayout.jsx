import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import fptLogo from '../assets/FPT_logo.webp';
import course from '../assets/course.gif'
import certificate from '../assets/certificate.gif'
import overview from '../assets/overview.gif'
import { Menu, X, LogOut } from 'lucide-react';
export default function EmployeeLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userData = sessionStorage.getItem('user');

        if (!token || !userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'EMPLOYEE') {
            navigate('/admin');
            return;
        }
        setUser(parsedUser);
    }, [navigate]);

    useEffect(() => {
        setIsDrawerOpen(false);
    }, [location]);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/dashboard/certificates')) return 'Chứng chỉ của tôi';
        if (path.includes('/dashboard/courses')) return 'Chi tiết khóa học';
        if (path.includes('/dashboard/quizzes')) return 'Bài kiểm tra';
        return 'Khóa học của tôi';
    };

    if (!user) return null;

    return (
        <div className="admin-layout">
            <header className="admin-topbar">
                <div className="topbar-left">
                    <button className="hamburger-btn" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                        <Menu size={24} />
                    </button>
                    <div className="topbar-logo">
                        <div><img src={fptLogo} alt="Fpt Logo" style={{ width: '40px', height: '30px' }} /></div>
                        <span className="topbar-title">FPT Training</span>
                    </div>
                </div>

                <div className="topbar-center">
                    <h1 className="header-title">{getPageTitle()}</h1>
                </div>

                <div className="topbar-right">
                    <div className="user-info text-right">
                        <span className="user-name">{user?.fullName}</span>
                        <span className="user-role">{user?.position || 'Nhân viên'}</span>
                    </div>
                    <div className="user-avatar">
                        {user?.fullName?.charAt(0)}
                    </div>
                </div>
            </header>

            <div className="admin-body-container">
                {isDrawerOpen && (
                    <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}></div>
                )}

                <aside className={`admin-drawer ${isDrawerOpen ? 'open' : ''}`}>
                    <div className="drawer-header">
                        <span>Menu Nhân Viên</span>
                        <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="sidebar-nav">
                        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                                <img src={course} alt="Khóa học" style={{ width: '24px', height: '24px' }} />
                            </div>
                            <span style={{ fontWeight: '500' }}>Khóa học</span>
                        </NavLink>
                        <NavLink to="/dashboard/certificates" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                                <img src={certificate} alt="Chứng chỉ" style={{ width: '24px', height: '24px' }} />
                            </div>
                            <span style={{ fontWeight: '500' }}>Chứng chỉ</span>
                        </NavLink>
                    </nav>

                    <div className="sidebar-footer">
                        <button onClick={handleLogout} className="logout-btn">
                            <LogOut size={20} /> Đăng xuất
                        </button>
                    </div>
                </aside>

                <main className="admin-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
