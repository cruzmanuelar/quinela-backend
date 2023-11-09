const controller = {}
const GetNextJourneyController = require('../../Methods/Matches/MetGetNextJourney')

controller.ValGetNextJourney = async (req, res) => {

    try{

        await GetNextJourneyController.MetGetNextJourney(req,res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener la proxima jornada',
                response: false
            }).end()
    }
}

module.exports = controller