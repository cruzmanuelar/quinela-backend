const controller = {}
const UserLoginController = require('../../Methods/Users/MetUserLogin')

controller.ValUserLogin = async (req, res) => {

    try{

        await UserLoginController.MetUserLogin(req, res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al logear al usuario',
                response: false
            }).end()
    }
}

module.exports = controller