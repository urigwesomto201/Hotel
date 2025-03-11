const { createCategory,getAll } = require('../controllers/categoryController');
const { authenticate,adminAuth } = require('../middlewares/authentication');

const router = require('express').Router();

router.post('/category', authenticate, adminAuth, createCategory)
router.get('get',getAll)

module.exports = router