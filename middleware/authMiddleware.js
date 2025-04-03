const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');
const userController = require('../controllers/users');

exports.authenticate = async (req, res, next) => {
    try {
        if (!req.headers.authorization) throw new Error("Bạn chưa đăng nhập");

        let token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, constants.SECRET_KEY);
        let user = await userController.GetUserById(decoded.id);
        if (!user) throw new Error("Người dùng không tồn tại");

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role.name)) {
            return res.status(403).json({ success: false, message: "Không có quyền truy cập" });
        }
        next();
    };
};
