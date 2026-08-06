import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { BookA, Users, Building, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/statistics');
                setData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Đang tải dữ liệu thống kê...</div>;
    if (!data) return <div style={{ padding: '2rem' }}>Lỗi tải dữ liệu.</div>;

    const { overview, recent_progress, department_distribution } = data;

    return (
        <div style={{ padding: '1.5rem', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            <h2 style={{ color: 'var(--fpt-blue)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={24} /> Tổng quan hệ thống
            </h2>

            {/* Thẻ Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#E0F2FE', borderRadius: '50%' }}>
                        <BookA size={28} color="#0284C7" />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem', fontWeight: 500 }}>Khóa học</p>
                        <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#111827' }}>{overview.courses}</h3>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#DCFCE7', borderRadius: '50%' }}>
                        <Users size={28} color="#16A34A" />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem', fontWeight: 500 }}>Nhân viên</p>
                        <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#111827' }}>{overview.employees}</h3>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#FEF3C7', borderRadius: '50%' }}>
                        <Building size={28} color="#D97706" />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem', fontWeight: 500 }}>Phòng ban</p>
                        <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#111827' }}>{overview.departments}</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Bảng Tiến độ gần đây */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem' }}>Tiến độ học tập gần đây</h3>
                    {recent_progress.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>Chưa có nhân viên nào bắt đầu học.</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #F3F4F6', textAlign: 'left', color: '#6B7280' }}>
                                    <th style={{ padding: '12px 8px' }}>Học viên</th>
                                    <th style={{ padding: '12px 8px' }}>Phòng ban</th>
                                    <th style={{ padding: '12px 8px' }}>Khóa học</th>
                                    <th style={{ padding: '12px 8px' }}>Tiến độ</th>
                                    <th style={{ padding: '12px 8px' }}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_progress.map(row => (
                                    <tr key={row.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '12px 8px', fontWeight: 500, color: '#1F2937' }}>{row.employee_name}</td>
                                        <td style={{ padding: '12px 8px', color: '#6B7280' }}>{row.department_name}</td>
                                        <td style={{ padding: '12px 8px', color: '#4B5563' }}>{row.course_name}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ flex: 1, height: '6px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${row.completion_percentage}%`, height: '100%', backgroundColor: row.completion_percentage === 100 ? '#10B981' : '#3B82F6' }}></div>
                                                </div>
                                                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>{row.completion_percentage}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, 
                                                backgroundColor: row.status === 'COMPLETED' ? '#D1FAE5' : '#DBEAFE', 
                                                color: row.status === 'COMPLETED' ? '#065F46' : '#1E40AF' 
                                            }}>
                                                {row.status === 'COMPLETED' ? 'HOÀN THÀNH' : 'ĐANG HỌC'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Biểu đồ Phân bố Nhân sự */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem' }}>Nhân sự theo Phòng ban</h3>
                    <div style={{ flex: 1, minHeight: '300px' }}>
                        {department_distribution.length === 0 ? (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                                Chưa có dữ liệu nhân sự.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                                    <Pie
                                        data={department_distribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {department_distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name, props) => [`${value} nhân sự`, name]} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
