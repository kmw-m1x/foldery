module.exports = (req, res, next) => {
    // req.user มาจาก authMiddleware ที่ทำงานก่อนหน้านี้
    if (req.user && req.user.role === 'admin') {
        next(); // เป็น Admin เชิญครับนายท่าน
    } else {
        res.status(403).json({ error: 'Access denied. Admins only!' }); // ไม่ใช่ Admin ไสหัวไป
    }
};