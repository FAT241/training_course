import { AlertTriangle, RefreshCcw } from 'lucide-react';

// Component hiển thị trạng thái lỗi khi API thất bại
export default function ErrorState({ message = 'Đã có lỗi xảy ra khi tải dữ liệu.', onRetry }) {
    return (
        <div className="error-state-container">
            <div className="error-state-icon">
                <AlertTriangle size={48} color="#EF4444" />
            </div>
            <h3 className="error-state-title">Không tải được dữ liệu</h3>
            <p className="error-state-message">{message}</p>
            {onRetry && (
                <button className="error-state-retry-btn" onClick={onRetry}>
                    <RefreshCcw size={16} />
                    Thử lại
                </button>
            )}
        </div>
    );
}
