const { register, verifyUser, login, getAll, makeAdmin } = require('../controllers/usercontroller');
const { authenticate, superAdminAuth } = require('../middlewares/authentication');
const {registers} = require('../middlewares/validator')
const router = require('express').Router();

router.post('/users',registers, register);

router.get('/verify-user/:token', verifyUser);

router.post('/login', login);

router.get('/users', authenticate, getAll);

router.patch('/make-admin/:id', authenticate, superAdminAuth, makeAdmin);




// router.post('/resend-verification', resendVerificationEmail);


module.exports = router
