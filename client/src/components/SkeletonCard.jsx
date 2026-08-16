// Component Skeleton Loading dùng chung toàn hệ thống

// Skeleton cho danh sách hàng (Courses, Employees, Departments)
export function SkeletonRow({ columns = 3 }) {
    return (
        <div className="skeleton-row">
            {Array.from({ length: columns }).map((_, i) => (
                <div key={i} className={`skeleton-cell ${i === 0 ? 'wide' : ''}`}>
                    <div className="skeleton-pulse" style={{ height: '16px', borderRadius: '6px', width: i === 0 ? '70%' : '50%' }} />
                </div>
            ))}
        </div>
    );
}

// Skeleton cho bảng danh sách
export function SkeletonTable({ rows = 5, columns = 3 }) {
    return (
        <div className="skeleton-table-wrapper">
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonRow key={i} columns={columns} />
            ))}
        </div>
    );
}

// Skeleton cho thẻ stat (Dashboard overview cards)
export function SkeletonStatCard() {
    return (
        <div className="skeleton-stat-card">
            <div className="skeleton-pulse" style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
                <div className="skeleton-pulse" style={{ height: '14px', width: '60%', borderRadius: '4px', marginBottom: '8px' }} />
                <div className="skeleton-pulse" style={{ height: '32px', width: '40%', borderRadius: '4px' }} />
            </div>
        </div>
    );
}

// Skeleton cho Dashboard (full page)
export function SkeletonDashboard() {
    return (
        <div style={{ padding: '2rem' }}>
            <div className="skeleton-pulse" style={{ height: '28px', width: '200px', borderRadius: '8px', marginBottom: '2rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="skeleton-stat-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem', height: '400px' }}>
                    <div className="skeleton-pulse" style={{ height: '20px', width: '40%', borderRadius: '4px' }} />
                    <SkeletonTable rows={6} columns={5} />
                </div>
                <div className="skeleton-stat-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
                    <div className="skeleton-pulse" style={{ width: '180px', height: '180px', borderRadius: '50%' }} />
                </div>
            </div>
        </div>
    );
}

export default SkeletonTable;
