const express = require('express');
const router = express.Router()

const GetUsersValidation = require('../../controllers/Validations/Users/ValGetUsers')
const GetScoreUsersValidation = require('../../controllers/Validations/Users/ValGetScoreUsers')
const UserLoginValidation = require('../../controllers/Validations/Users/ValUserLogin')


router.post('/all', GetUsersValidation.ValGetUsers)
router.post('/scores', GetScoreUsersValidation.ValGetScoreUsers)
router.post('/login', UserLoginValidation.ValUserLogin)

module.exports = router