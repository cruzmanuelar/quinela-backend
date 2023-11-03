const controller = {}
const CreateQuinelaController = require('../../Methods/Matches/MetCreateQuinela')

controller.ValCreateQuinela = async (req, res) => {

    try{

        await CreateQuinelaController.MetCreateQuinela(req, res)
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al crear la quinela',
                response: false
            }).end()
    }
}

module.exports = controller