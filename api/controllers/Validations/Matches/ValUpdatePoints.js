const controller = {}
const UpdatePointsController = require('../../Methods/Matches/MetUpdatePoints')

controller.ValUpdatePoints = async (req, res) => {

    try{

        await UpdatePointsController.MetUpdatePoints(req,res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al actualizar los puntajes',
                response: false
            }).end()
    }
}

module.exports = controller