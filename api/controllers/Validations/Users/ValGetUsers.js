const controller = {}
const GetUsersController = require('../../Methods/Users/MetGetUsers')

controller.ValGetUsers = async (req, res) => {

    try{

        await GetUsersController.MetGetUsers(req, res)
        
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