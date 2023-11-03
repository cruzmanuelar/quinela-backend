const controller = {}
const EndMatchController = require('../../Methods/Matches/MetEndMatch')

controller.ValEndMatch = async (req, res) => {

    try{

        await EndMatchController.MetEndMatch(req,res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al marcar como finalizado el partido',
                response: false
            }).end()
    }
}

module.exports = controller