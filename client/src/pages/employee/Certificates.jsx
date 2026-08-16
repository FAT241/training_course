import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Award, Calendar, CheckCircle, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function Certificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const res = await api.get('/employee/certificates');
                setCertificates(res.data);
            } catch (err) {
                console.error('Lỗi lấy chứng chỉ', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCerts();
    }, []);

    const handleDownload = (certId, courseName) => {
        const element = document.getElementById(`cert-card-${certId}`);
        const w = element.offsetWidth;
        const h = element.offsetHeight;

        const opt = {
            margin:      0,
            filename:    `Chung_Chi_${courseName.replace(/\s+/g, '_')}.pdf`,
            image:       { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF:       { unit: 'px', format: [w, h], orientation: 'landscape', hotfixes: ['px_scaling'] }
        };

        html2pdf().set(opt).from(element).save();
    };

    if (loading) return <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>Đang tải danh sách chứng chỉ...</div>;

    return (
        <div style={{ padding: '0' }}>
            <div className="content-header" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', color: 'white', margin: 0, fontWeight: '800' }}>Chứng chỉ của tôi</h2>
            </div>

            {certificates.length === 0 ? (
                <div className="empty-state" style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                    <Award size={64} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ margin: '0 0 8px 0', color: 'white', fontSize: '18px' }}>Bạn chưa có chứng chỉ nào</h3>
                    <p style={{ margin: 0, color: '#cbd5e1' }}>Hãy hoàn thành 100% tiến độ của một khóa học để nhận chứng chỉ nhé!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
                    {certificates.map(cert => (
                        <div key={cert.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div 
                                id={`cert-card-${cert.id}`}
                                style={{ 
                                    background: '#fff',
                                    border: '12px solid #1e3a8a',
                                    padding: '4px',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: '700px',
                                    aspectRatio: '1.414 / 1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                }}
                            >
                                {/* Inner border viền vàng */}
                                <div style={{ 
                                    border: '2px solid #fbbf24', 
                                    height: '100%',
                                    padding: '24px 16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <Award size={24} color="#d97706" />
                                        <h1 style={{ color: '#1e3a8a', fontSize: '18px', letterSpacing: '1px', textTransform: 'uppercase', margin: 0, fontFamily: '"Times New Roman", Times, serif', fontWeight: '800' }}>
                                            CHỨNG NHẬN HOÀN THÀNH
                                        </h1>
                                        <Award size={24} color="#d97706" />
                                    </div>
                                    
                                    <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 12px 0', fontStyle: 'italic' }}>
                                        Hệ thống đào tạo hân hạnh chứng nhận
                                    </p>
                                    
                                    <h2 style={{ color: '#0f172a', fontSize: '28px', fontFamily: '"Times New Roman", Times, serif', fontStyle: 'italic', margin: '0 0 16px 0', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', width: '90%' }}>
                                        {cert.full_name}
                                    </h2>
                                    
                                    <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 8px 0' }}>
                                        Đã hoàn thành xuất sắc khóa học:
                                    </p>
                                    
                                    <h3 style={{ color: '#b45309', fontSize: '16px', fontWeight: 'bold', margin: '0 0 auto 0', lineHeight: '1.4' }}>
                                        {cert.course_name}
                                    </h3>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '24px', alignItems: 'flex-end' }}>
                                        <div style={{ textAlign: 'left' }}>
                                            <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 4px 0' }}>Mã số: <strong>{cert.certificate_code}</strong></p>
                                            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Cấp ngày: <strong>{new Date(cert.issue_date).toLocaleDateString('vi-VN')}</strong></p>
                                        </div>
                                        
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '28px', color: '#1e3a8a', lineHeight: '1', margin: '0 0 4px 0' }}>
                                                Director
                                            </div>
                                            <div style={{ borderTop: '1px solid #94a3b8', width: '120px', margin: '0 auto', paddingTop: '4px' }}>
                                                <p style={{ fontSize: '10px', fontWeight: 'bold', margin: '0 0 2px 0', color: '#0f172a' }}>Giám đốc Đào tạo</p>
                                                <p style={{ fontSize: '9px', color: '#64748b', margin: 0 }}>FPT Software</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Nút tải PDF nằm ngoài chứng chỉ */}
                            <button 
                                onClick={() => handleDownload(cert.id, cert.course_name)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    padding: '12px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background 0.2s', boxShadow: '0 2px 4px rgba(14,165,233,0.3)'
                                }}
                                onMouseOver={e=>e.currentTarget.style.backgroundColor='#0284c7'}
                                onMouseOut={e=>e.currentTarget.style.backgroundColor='#0ea5e9'}
                            >
                                <Download size={20} /> Tải chứng chỉ (PDF)
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
