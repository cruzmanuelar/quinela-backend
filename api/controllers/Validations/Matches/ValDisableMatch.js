const controller = {}
const DisableMatchController = require('../../Methods/Matches/MetDisableMatch')

controller.ValDisableMatch = async (req, res) => {

    try{

        await DisableMatchController.MetDisableMatch(req,res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al actualizar el partido',
                response: false
            }).end()
    }
}

module.exports = controller