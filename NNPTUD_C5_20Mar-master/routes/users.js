const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');


router.get('/', authenticate, authorize(["mod"]), async (req, res) => {
  try {
    let users = await userController.GetAllUser();
    CreateSuccessRes(res, 200, users);
  } catch (error) {
    CreateErrorRes(res, 500, error.message);
  }
});


router.get('/:id', authenticate, authorize(["mod"]), async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Không thể xem thông tin của chính mình" });
    }
    let user = await userController.GetUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User không tồn tại" });

    CreateSuccessRes(res, 200, user);
  } catch (error) {
    CreateErrorRes(res, 500, error.message);
  }
});


router.post('/', authenticate, authorize(["admin"]), async (req, res) => {
  try {
    let { username, password, email, role } = req.body;
    let newUser = await userController.CreateAnUser(username, password, email, role);
    CreateSuccessRes(res, 201, newUser);
  } catch (error) {
    CreateErrorRes(res, 500, error.message);
  }
});


router.put('/:id', authenticate, authorize(["admin"]), async (req, res) => {
  try {
    let updatedUser = await userController.UpdateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ success: false, message: "User không tồn tại" });

    CreateSuccessRes(res, 200, updatedUser);
  } catch (error) {
    CreateErrorRes(res, 500, error.message);
  }
});


router.delete('/:id', authenticate, authorize(["admin"]), async (req, res) => {
  try {
    let deletedUser = await userController.DeleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ success: false, message: "User không tồn tại" });

    CreateSuccessRes(res, 200, { message: "User đã bị xóa", data: deletedUser });
  } catch (error) {
    CreateErrorRes(res, 500, error.message);
  }
});

module.exports = router;
