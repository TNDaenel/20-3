const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { authenticate } = require('../middleware/authMiddleware');
const { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');


router.post('/login', async (req, res, next) => {
    try {
        let { username, password } = req.body;
        let result = await userController.Login(username, password);
        let token = jwt.sign({ id: result._id, role: result.role, expire: new Date(Date.now() + 24 * 3600 * 1000) }, constants.SECRET_KEY);

        CreateSuccessRes(res, 200, { token });
    } catch (error) {
        next(error);
    }
});


router.post('/signup', async (req, res, next) => {
    try {
        let { username, password, email } = req.body;
        let result = await userController.CreateAnUser(username, password, email, 'user');
        let token = jwt.sign({ id: result._id, role: result.role, expire: new Date(Date.now() + 24 * 3600 * 1000) }, constants.SECRET_KEY);

        CreateSuccessRes(res, 200, { token });
    } catch (error) {
        next(error);
    }
});


router.get('/me', authenticate, async (req, res) => {
    res.status(200).send({ success: true, data: req.user });
});


router.post('/changePassword', authenticate, async (req, res, next) => {
    try {
        let { oldPassword, newPassword } = req.body;
        let user = req.user;
        let result = await userController.ChangePassword(user._id, oldPassword, newPassword);

        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});


router.use(authenticate);

module.exports = router;
