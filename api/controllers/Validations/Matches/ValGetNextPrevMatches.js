const controller = {}
const GetNextPrevMatchesController = require('../../Methods/Matches/MetGetNextPrevMatches')

controller.ValGetNextPrevMatches = async (req, res) => {

    try{

        await GetNextPrevMatchesController.MetGetNextPrevMatches(req,res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener los partidos',
                response: false
            }).end()
    }
}

module.exports = controller