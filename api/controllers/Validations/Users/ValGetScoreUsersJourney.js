const controller = {}
const GetScoreUsersJourneyController = require('../../Methods/Users/MetGetScoreUsersJourney')

controller.ValGetScoreUsersJourney = async (req, res) => {

    try{

        await GetScoreUsersJourneyController.MetGetScoreUsersJourney(req, res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener la tabla de posiciones',
                response: false
            }).end()
    }
}

module.exports = controller