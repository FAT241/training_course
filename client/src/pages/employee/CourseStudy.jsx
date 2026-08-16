import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { PlayCircle, FileText, ChevronDown, ChevronRight, Award, ArrowLeft } from 'lucide-react';

export default function CourseStudy() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/employee/courses/${id}`);
                setCourse(res.data);
                
                if (res.data.chapters && res.data.chapters.length > 0) {
                    const firstChapter = res.data.chapters[0];
                    setExpandedChapters({ [firstChapter.id]: true });
                    if (firstChapter.lessons && firstChapter.lessons.length > 0) {
                        setActiveLesson(firstChapter.lessons[0]);
                    }
                }
            } catch (err) {
                setError('Không thể tải chi tiết khóa học hoặc bạn không có quyền truy cập.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const toggleChapter = (chapterId) => {
        setExpandedChapters(prev => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
    };

    if (loading) return <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>Đang tải nội dung khóa học...</div>;
    if (error) return <div className="error-message" style={{ margin: '20px' }}>{error}</div>;
    if (!course) return null;

    const getMediaUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    return (
        <div className="course-study-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)', margin: '-32px' }}>
            <div className="study-header" style={{ padding: '16px 24px', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontWeight: '600', padding: '8px 12px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='rgba(255, 255, 255, 0.1)'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                    <ArrowLeft size={20} /> Trở về
                </button>
                <div style={{ height: '24px', width: '2px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
                <h2 style={{ fontSize: '18px', margin: 0, color: 'white', fontWeight: '800' }}>{course.course_name}</h2>
            </div>

            <div className="study-body" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div className="study-content-viewer" style={{ flex: '1', backgroundColor: '#0f172a', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    {activeLesson ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', overflowY: 'hidden', backgroundColor: 'transparent' }}>
                            {activeLesson.content_type === 'VIDEO' ? (
                                getYoutubeEmbedUrl(activeLesson.file_path) ? (
                                    <iframe 
                                        key={activeLesson.id}
                                        src={getYoutubeEmbedUrl(activeLesson.file_path)}
                                        style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#000' }}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={activeLesson.lesson_name}
                                    />
                                ) : (
                                    <video 
                                        key={activeLesson.id}
                                        src={getMediaUrl(activeLesson.file_path)} 
                                        controls 
                                        style={{ width: '100%', height: '100%', maxHeight: '100%', backgroundColor: '#000' }}
                                        controlsList="nodownload"
                                    >
                                        Trình duyệt của bạn không hỗ trợ thẻ video.
                                    </video>
                                )
                            ) : (
                                <iframe 
                                    key={activeLesson.id}
                                    src={getMediaUrl(activeLesson.file_path)} 
                                    style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#fff' }}
                                    title={activeLesson.lesson_name}
                                />
                            )}
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexDirection: 'column', gap: '16px' }}>
                            <PlayCircle size={64} opacity={0.2} />
                            <p style={{ fontSize: '18px' }}>Chọn một bài học ở menu bên phải để bắt đầu</p>
                        </div>
                    )}
                    
                    {/* Thanh công cụ / Thông tin bài giảng bên dưới Video */}
                    {activeLesson && (
                        <div style={{ padding: '24px', backgroundColor: '#1e293b', color: '#fff' }}>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '22px', fontWeight: '700' }}>{activeLesson.lesson_name}</h3>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#94a3b8' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px' }}>
                                    {activeLesson.content_type === 'VIDEO' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                    {activeLesson.content_type === 'VIDEO' ? 'Video Bài giảng' : 'Tài liệu đọc (PDF)'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Mục lục khóa học */}
                <div className="study-sidebar" style={{ width: '420px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'transparent' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'white' }}>Nội dung khóa học</h3>
                        <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>Hoàn thành tất cả các bài học và bài kiểm tra để nhận chứng chỉ.</p>
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {course.chapters && course.chapters.map((chapter, index) => (
                            <div key={chapter.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                {/* Header của Chương */}
                                <div 
                                    onClick={() => toggleChapter(chapter.id)}
                                    style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s', backgroundColor: expandedChapters[chapter.id] ? 'rgba(255, 255, 255, 0.05)' : 'transparent' }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                                    onMouseOut={(e) => { if(!expandedChapters[chapter.id]) e.currentTarget.style.backgroundColor = 'transparent' }}
                                >
                                    <div style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>
                                        {chapter.chapter_name}
                                    </div>
                                    {expandedChapters[chapter.id] ? <ChevronDown size={20} color="#64748b" /> : <ChevronRight size={20} color="#64748b" />}
                                </div>
                                
                                {/* Danh sách bài học trong Chương */}
                                {expandedChapters[chapter.id] && (
                                    <div style={{ padding: '8px 0' }}>
                                        {chapter.lessons && chapter.lessons.map((lesson) => (
                                            <div 
                                                key={lesson.id}
                                                onClick={() => setActiveLesson(lesson)}
                                                style={{ 
                                                    padding: '14px 24px 14px 44px', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '14px', 
                                                    cursor: 'pointer',
                                                    backgroundColor: activeLesson?.id === lesson.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                                    color: activeLesson?.id === lesson.id ? '#38bdf8' : '#cbd5e1',
                                                    borderRight: activeLesson?.id === lesson.id ? '4px solid #38bdf8' : '4px solid transparent',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => { if(activeLesson?.id !== lesson.id) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)' }}
                                                onMouseOut={(e) => { if(activeLesson?.id !== lesson.id) e.currentTarget.style.backgroundColor = 'transparent' }}
                                            >
                                                {lesson.content_type === 'VIDEO' ? <PlayCircle size={18} /> : <FileText size={18} />}
                                                <span style={{ fontSize: '14px', fontWeight: activeLesson?.id === lesson.id ? '700' : '500' }}>
                                                    {lesson.lesson_name}
                                                </span>
                                            </div>
                                        ))}
                                        
                                        {/* Nút làm bài tập (nếu có Quiz) */}
                                        {chapter.quiz && (
                                            <div style={{ padding: '16px 24px 16px 44px' }}>
                                                <button 
                                                    onClick={() => navigate(`/dashboard/quizzes/${chapter.quiz.id}`)}
                                                    style={{ 
                                                        width: '100%',
                                                        padding: '12px', 
                                                        display: 'flex', 
                                                        justifyContent: 'center',
                                                        alignItems: 'center', 
                                                        gap: '10px', 
                                                        cursor: 'pointer',
                                                        backgroundColor: '#0ea5e9',
                                                        color: '#ffffff',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontWeight: '600',
                                                        fontSize: '14px',
                                                        transition: 'all 0.2s',
                                                        boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)'
                                                    }}
                                                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#0284c7'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#0ea5e9'; e.currentTarget.style.transform = 'translateY(0)' }}
                                                >
                                                    <Award size={18} />
                                                    Làm bài kiểm tra (Pass: {chapter.quiz.passing_score})
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
}
