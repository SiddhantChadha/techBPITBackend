const express = require('express')
const router = express.Router();

const { signUp,login,refresh,verify } = require('../controllers/authController')

router.post('/signup',signUp)
router.post('/login',login)
router.post('/verify',verify)
router.post('/access_token/renew',refresh)

module.exports = router;