import { PackageOpen } from 'lucide-react';

// Component hiển thị trạng thái danh sách trống
export default function EmptyState({ title = 'Chưa có dữ liệu', description = 'Hãy thêm mới để bắt đầu.', actionText, onAction, icon: Icon = PackageOpen }) {
    return (
        <div className="empty-state-container">
            <div className="empty-state-icon">
                <Icon size={52} strokeWidth={1.2} />
            </div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            {actionText && onAction && (
                <button className="btn-primary create-btn" onClick={onAction} style={{ marginTop: '0.5rem' }}>
                    {actionText}
                </button>
            )}
        </div>
    );
}
