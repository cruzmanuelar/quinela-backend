const controller = {}
const CreateMatchesController = require('../../Methods/Matches/MetCreateMatches')

controller.ValCreateMatches = async (req, res) => {

    try{

        await CreateMatchesController.MetCreateMatches(req,res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener los usuarios',
                response: false
            }).end()
    }
}

module.exports = controller