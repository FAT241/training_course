import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { BookA, Users, Building, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import courseGif from '../../assets/course.gif';
import employeeGif from '../../assets/employee.gif';
import departmentGif from '../../assets/department.gif';

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
        <div style={{ padding: '1.5rem', backgroundColor: 'transparent', minHeight: '100vh' }}>
            <h2 style={{ color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={24} /> Tổng quan hệ thống
            </h2>

            {/* Thẻ Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(14, 165, 233, 0.15)', borderRadius: '50%' }}>
                        <img src={courseGif} alt="Khóa học" style={{ width: '24px', height: '24px' }} />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>Khóa học</p>
                        <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>{overview.courses}</h3>
                    </div>
                </div>

                <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%' }}>
                        <img src={employeeGif} alt="Nhân viên" style={{ width: '32px', height: '32px' }} />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>Nhân viên</p>
                        <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>{overview.employees}</h3>
                    </div>
                </div>

                <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%' }}>
                        <img src={departmentGif} alt="Phòng ban" style={{ width: '32px', height: '32px' }} />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>Phòng ban</p>
                        <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>{overview.departments}</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Bảng Tiến độ gần đây */}
                <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.1rem' }}>Tiến độ học tập gần đây</h3>
                    {recent_progress.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Chưa có nhân viên nào bắt đầu học.</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)', textAlign: 'left', color: '#94a3b8' }}>
                                    <th style={{ padding: '12px 8px' }}>Học viên</th>
                                    <th style={{ padding: '12px 8px' }}>Phòng ban</th>
                                    <th style={{ padding: '12px 8px' }}>Khóa học</th>
                                    <th style={{ padding: '12px 8px' }}>Tiến độ</th>
                                    <th style={{ padding: '12px 8px' }}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_progress.map(row => (
                                    <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '12px 8px', fontWeight: 500, color: 'white' }}>{row.employee_name}</td>
                                        <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>{row.department_name}</td>
                                        <td style={{ padding: '12px 8px', color: '#94a3b8' }}>{row.course_name}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${row.completion_percentage}%`, height: '100%', backgroundColor: row.completion_percentage === 100 ? '#10B981' : '#3B82F6' }}></div>
                                                </div>
                                                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{row.completion_percentage}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                                backgroundColor: row.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                                color: row.status === 'COMPLETED' ? '#10B981' : '#60a5fa'
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
                <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.1rem' }}>Nhân sự theo Phòng ban</h3>
                    <div style={{ flex: 1, minHeight: '380px' }}>
                        {department_distribution.length === 0 ? (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                Chưa có dữ liệu nhân sự.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                                    <Pie
                                        data={department_distribution}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        fill="#8884d8"
                                        paddingAngle={3}
                                        dataKey="value"
                                        stroke="rgba(255,255,255,0.1)"
                                    >
                                        {department_distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value, name, props) => [`${value} nhân sự`, name]} 
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                                        itemStyle={{ color: 'white' }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        iconType="circle" 
                                        wrapperStyle={{ paddingTop: '20px', fontSize: '0.85rem', color: '#cbd5e1' }} 
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
