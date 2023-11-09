const controller = {}
const SelectNextJourneyController = require('../../Methods/Matches/MetSelectNextJourney')

controller.ValSelectNextJourney = async (req, res) => {

    try{

        await SelectNextJourneyController.MetSelectNextJourney(req,res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al establecer la proxima jornada',
                response: false
            }).end()
    }
}

module.exports = controller