const express = require('express');
const router = express.Router()

const CreateMatchesValidation = require('../../controllers/Validations/Matches/ValCreateMatches')
const GetMatchValidation = require('../../controllers/Validations/Matches/ValGetMatch')
const EndMatchValidation = require('../../controllers/Validations/Matches/ValEndMatch')
const NextPrevMatchesValidation = require('../../controllers/Validations/Matches/ValGetNextPrevMatches')
const CreateQuinelaValidation = require('../../controllers/Validations/Matches/ValCreateQuinela')
const GetAllMatchesValidation = require('../../controllers/Validations/Matches/ValGetAllMatches')
const GetPredictionsMatchValidation = require('../../controllers/Validations/Matches/ValGetPredictionsMatch')
const SelectNextJourneyValidation = require('../../controllers/Validations/Matches/ValSelectNextJourney')
const GetJourneysValidation = require('../../controllers/Validations/Matches/ValGetJourneys')
const GetNextJourneyValidation = require('../../controllers/Validations/Matches/ValGetNextJourney')


router.post('/create', CreateMatchesValidation.ValCreateMatches)
router.post('/match', GetMatchValidation.ValGetMatch)
router.post('/endMatch', EndMatchValidation.ValEndMatch)
router.post('/next-prev', NextPrevMatchesValidation.ValGetNextPrevMatches)
router.post('/create-quinela', CreateQuinelaValidation.ValCreateQuinela)
router.post('/get-all', GetAllMatchesValidation.ValGetAllMatches)
router.post('/predictions-journey', GetPredictionsMatchValidation.ValGetPredictionsMatch)
router.post('/select-next-journey', SelectNextJourneyValidation.ValSelectNextJourney)
router.post('/get-journeys', GetJourneysValidation.ValGetJourneys)
router.post('/get-next-journey', GetNextJourneyValidation.ValGetNextJourney)

module.exports = router