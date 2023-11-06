const controller = {}
const GetAllMatchesController = require('../../Methods/Matches/MetGetAllMatches')

controller.ValGetAllMatches = async (req, res) => {

    try{

        await GetAllMatchesController.MetGetAllMatches(req,res)
        
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