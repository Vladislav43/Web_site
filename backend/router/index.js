const Router = require('express').Router

const router = new Router();


router.post('/registration');
router.post('/login');
router.post('/logout');
router.get('/activate/:link');
router.get('/refresh')
router.get('/anceta', getAllUsers);
router.put('/update', verifyToken, updateUser);

module.exports = router