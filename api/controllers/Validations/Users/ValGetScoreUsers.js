const controller = {}
const GetScoreUsersController = require('../../Methods/Users/MetGetScoreUsers')

controller.ValGetScoreUsers = async (req, res) => {

    try{

        await GetScoreUsersController.MetGetScoreUsers(req, res)
        
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