const controller = {}
const GetTablePlayoffController = require('../../Methods/Playoff/MetGetTablePlayoff')

controller.ValGetTablePlayOff = async (req, res) => {

    try{

        await GetTablePlayoffController.MetGetTablePlayOff(req, res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener la tabla de posiciones',
                response: false
            }).end()
    }
}

module.exports = controller