const controller = {}
const UserValidationController = require('../../Methods/Users/MetUserValidation')

controller.ValUserValidation = async (req, res) => {

    try{

        await UserValidationController.MetUserValidation(req, res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al validar al usuario',
                response: false
            }).end()
    }
}

module.exports = controller