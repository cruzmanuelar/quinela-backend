const express = require('express');
const router = express.Router()

const GetTablePlayoff = require('../../controllers/Validations/Playoff/ValGetTablePlayoff')
router.post('/get-table', GetTablePlayoff.ValGetTablePlayOff)


module.exports = router