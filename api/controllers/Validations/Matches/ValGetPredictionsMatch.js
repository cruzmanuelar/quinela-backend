const controller = {}
const GetPredictionMatchController = require('../../Methods/Matches/MetGetPredictionsMatch')

controller.ValGetPredictionsMatch = async (req, res) => {

    try{

        await GetPredictionMatchController.MetGetPredictionsMatch(req,res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener las predicciones del partido',
                response: false
            }).end()
    }
}

module.exports = controller