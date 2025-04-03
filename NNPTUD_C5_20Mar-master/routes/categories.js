const express = require('express');
const router = express.Router();
const categoryModel = require('../schemas/category');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    let categories = await categoryModel.find({});
    res.status(200).send({ success: true, data: categories });
});


router.get('/:id', async (req, res) => {
    try {
        let category = await categoryModel.findById(req.params.id);
        if (!category) return res.status(404).send({ success: false, message: "Không có ID phù hợp" });

        res.status(200).send({ success: true, data: category });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});


router.post('/', authenticate, authorize(["mod"]), async (req, res) => {
    try {
        let newCategory = new categoryModel({ name: req.body.name });
        await newCategory.save();
        res.status(201).send({ success: true, data: newCategory });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});


router.put('/:id', authenticate, authorize(["mod"]), async (req, res) => {
    try {
        let updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!updatedCategory) return res.status(404).send({ success: false, message: "Category không tồn tại" });

        res.status(200).send({ success: true, data: updatedCategory });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});


router.delete('/:id', authenticate, authorize(["admin"]), async (req, res) => {
    try {
        let deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).send({ success: false, message: "Category không tồn tại" });

        res.status(200).send({ success: true, message: "Category đã bị xóa", data: deletedCategory });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

module.exports = router;
