const express = require('express');
const router = express.Router()

const CreateMatchesValidation = require('../../controllers/Validations/Matches/ValCreateMatches')
const GetMatchValidation = require('../../controllers/Validations/Matches/ValGetMatch')
const EndMatchValidation = require('../../controllers/Validations/Matches/ValEndMatch')
const NextPrevMatchesValidation = require('../../controllers/Validations/Matches/ValGetNextPrevMatches')
const CreateQuinelaValidation = require('../../controllers/Validations/Matches/ValCreateQuinela')

router.post('/create', CreateMatchesValidation.ValCreateMatches)
router.post('/match', GetMatchValidation.ValGetMatch)
router.post('/endMatch', EndMatchValidation.ValEndMatch)
router.post('/next-prev', NextPrevMatchesValidation.ValGetNextPrevMatches)
router.post('/create-quinela', CreateQuinelaValidation.ValCreateQuinela)

module.exports = router