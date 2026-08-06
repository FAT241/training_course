const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            message: 'Không có token, từ chối truy cập'
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded
            = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Chỉ Admin mới có quyền' });
    }
    next();
};
const requireEmployee = (req, res, next) => {
    if (req.user?.role !== 'EMPLOYEE') {
        return res.status(403).json({
            message: 'Chỉ employee mới có quyền'
        });
    }
    next();
}
module.exports = { verifyToken, requireAdmin, requireEmployee };