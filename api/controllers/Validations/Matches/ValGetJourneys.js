const controller = {}
const GetJourneysController = require('../../Methods/Matches/MetGetJourneys')

controller.ValGetJourneys = async (req, res) => {

    try{

        await GetJourneysController.MetGetJourneys(req,res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener las jornadas',
                response: false
            }).end()
    }
}

module.exports = controller