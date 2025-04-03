const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roles');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');


router.get('/', async (req, res) => {
    try {
        let roles = await roleController.GetAllRole();
        CreateSuccessRes(res, 200, roles);
    } catch (error) {
        CreateErrorRes(res, 500, error.message);
    }
});


router.get('/:id', async (req, res) => {
    try {
        let role = await roleController.GetRoleById(req.params.id);
        if (!role) return res.status(404).send({ success: false, message: "Vai trò không tồn tại" });

        CreateSuccessRes(res, 200, role);
    } catch (error) {
        CreateErrorRes(res, 500, error.message);
    }
});


router.post('/', authenticate, authorize(["admin"]), async (req, res) => {
    try {
        let newRole = await roleController.CreateRole(req.body.name);
        CreateSuccessRes(res, 201, newRole);
    } catch (error) {
        CreateErrorRes(res, 500, error.message);
    }
});


router.put('/:id', authenticate, authorize(["admin"]), async (req, res) => {
    try {
        let updatedRole = await roleController.UpdateRole(req.params.id, req.body);
        if (!updatedRole) return res.status(404).send({ success: false, message: "Vai trò không tồn tại" });

        CreateSuccessRes(res, 200, updatedRole);
    } catch (error) {
        CreateErrorRes(res, 500, error.message);
    }
});


router.delete('/:id', authenticate, authorize(["admin"]), async (req, res) => {
    try {
        let deletedRole = await roleController.DeleteRole(req.params.id);
        if (!deletedRole) return res.status(404).send({ success: false, message: "Vai trò không tồn tại" });

        CreateSuccessRes(res, 200, { message: "Vai trò đã bị xóa", data: deletedRole });
    } catch (error) {
        CreateErrorRes(res, 500, error.message);
    }
});

module.exports = router;
