const express = require('express');
const router = express.Router()

const GetUsersValidation = require('../../controllers/Validations/Users/ValGetUsers')
const GetScoreUsersValidation = require('../../controllers/Validations/Users/ValGetScoreUsers')
const GetScoreUsersJourneyValidation = require('../../controllers/Validations/Users/ValGetScoreUsersJourney')
const UserLoginValidation = require('../../controllers/Validations/Users/ValUserLogin')
const UserValidation = require('../../controllers/Validations/Users/ValUserValidation')

router.post('/all', GetUsersValidation.ValGetUsers)
router.post('/scores', GetScoreUsersValidation.ValGetScoreUsers)
router.post('/scores-journey', GetScoreUsersJourneyValidation.ValGetScoreUsersJourney)
router.post('/login', UserLoginValidation.ValUserLogin)
router.post('/user-validation', UserValidation.ValUserValidation)

module.exports = router