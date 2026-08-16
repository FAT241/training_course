export const getCourseImage = (courseName) => {
    if (!courseName) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    const name = courseName.toLowerCase();
    
    if (name.includes('react') || name.includes('lập trình') || name.includes('code') || name.includes('kỹ thuật')) {
        return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('văn hóa') || name.includes('onboarding') || name.includes('hội nhập')) {
        return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('thời gian') || name.includes('kỹ năng') || name.includes('giao tiếp')) {
        return 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('agile') || name.includes('scrum') || name.includes('dự án') || name.includes('quản lý')) {
        return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
    
    // Mặc định
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
};
