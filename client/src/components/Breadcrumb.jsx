import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Component Breadcrumb điều hướng
// items: [{ label: 'Khóa học', to: '/admin/courses' }, { label: 'Lập trình React' }]
export default function Breadcrumb({ items = [] }) {
    return (
        <nav className="breadcrumb-nav" aria-label="breadcrumb">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <span key={index} className="breadcrumb-item">
                        {index > 0 && (
                            <ChevronRight size={14} className="breadcrumb-separator" />
                        )}
                        {isLast || !item.to ? (
                            <span className={`breadcrumb-label ${isLast ? 'active' : ''}`}>
                                {item.label}
                            </span>
                        ) : (
                            <Link to={item.to} className="breadcrumb-link">
                                {item.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
