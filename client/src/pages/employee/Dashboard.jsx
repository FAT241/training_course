import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { BookOpen, PlayCircle, Search } from 'lucide-react';
import { getCourseImage } from '../../utils/getCourseImage';

export default function EmployeeDashboard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/employee/courses');
                setCourses(res.data);
            } catch (err) {
                console.error('Lỗi lấy khóa học:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>Đang tải danh sách khóa học...</div>;

    const filteredCourses = courses.filter(course => 
        course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div>
            <div className="content-header" style={{ marginBottom: '24px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                    <input 
                        type="text" 
                        placeholder="Bạn muốn học gì hôm nay?" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 16px 14px 44px',
                            borderRadius: '30px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: 'rgba(30, 41, 59, 0.7)',
                            backdropFilter: 'blur(10px)',
                            fontSize: '15px',
                            color: 'white',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#38bdf8';
                            e.target.style.boxShadow = '0 0 0 4px rgba(56, 189, 248, 0.15)';
                            e.target.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                            e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.7)';
                        }}
                    />
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="empty-state">
                    <BookOpen size={48} className="empty-icon" />
                    <h3>Không tìm thấy khóa học nào</h3>
                    <p>Thử tìm với từ khóa khác xem sao nhé.</p>
                </div>
            ) : (
                <div className="employee-courses-grid">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="premium-course-card">
                            {/* ẢNH NỀN TỰ ĐỘNG ĐƯỢC LẤY THEO TÊN KHÓA HỌC */}
                            <div className="card-image-wrapper" style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                                <img 
                                    src={getCourseImage(course.course_name)} 
                                    alt="Course Background" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                <span className={`premium-badge ${course.course_type.toLowerCase()}`} style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                                    {course.course_type === 'PUBLIC' ? 'Công Khai' : 'Nội Bộ'}
                                </span>
                                {/* Lớp phủ gradient nhẹ để chữ dễ đọc nếu cần */}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1) 100%)', zIndex: 1 }}></div>
                            </div>
                            <div className="premium-card-content">
                                <h3 className="premium-course-title">{course.course_name}</h3>
                                <p className="premium-course-desc">{course.description}</p>
                                
                                <div className="premium-progress-section">
                                    <div className="progress-labels">
                                        <span className="progress-text-label">Tiến độ học tập</span>
                                        <span className="progress-percentage">{course.progress}%</span>
                                    </div>
                                    <div className="premium-progress-track">
                                        <div className="premium-progress-fill" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>
                                
                                {course.quiz_results && course.quiz_results.length > 0 && (
                                    <div style={{ marginTop: '12px', marginBottom: '16px', fontSize: '0.85rem', color: '#cbd5e1', backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <div style={{ fontWeight: '600', marginBottom: '8px', color: 'white' }}>Điểm các bài kiểm tra:</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {course.quiz_results.map((q, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{q.chapter_name}</span>
                                                    <span style={{ 
                                                        fontWeight: '700', 
                                                        padding: '2px 6px', 
                                                        borderRadius: '4px',
                                                        backgroundColor: q.score >= q.passing_score ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                        color: q.score >= q.passing_score ? '#34d399' : '#f87171' 
                                                    }}>
                                                        {q.score} điểm (Cần: {q.passing_score})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <button onClick={() => navigate(`/dashboard/courses/${course.id}`)} className="premium-btn">
                                    <PlayCircle size={20} /> {course.progress > 0 ? 'Tiếp tục học' : 'Vào học ngay'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
