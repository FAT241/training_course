import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { BookA, Users, Building, AlertCircle } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({ courses: 0, employees: 0, departments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [courses, employees, departments] = await Promise.all([
                    api.get('/courses'), api.get('/employees'), api.get('/departments')
                ]);
                setStats({
                    courses: courses.data.length,
                    employees: employees.data.length,
                    departments: departments.data.length
                });
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Đang tải...</div>;

    return (
        <div>
            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-icon orange"><BookA /></div>
                    <div className="stat-info"><h3>Tổng Khóa học</h3><p>{stats.courses}</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green"><Users /></div>
                    <div className="stat-info"><h3>Tổng Nhân viên</h3><p>{stats.employees}</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue"><Building /></div>
                    <div className="stat-info"><h3>Phòng ban</h3><p>{stats.departments}</p></div>
                </div>
            </div>
        </div>
    );
}
