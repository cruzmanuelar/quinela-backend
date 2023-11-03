const controller = {}
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetUserLogin = async (req, res) => {

    const {
        req_usucorreo
    } = req.body

    let jsonResponse = {
        message : "Se logeo al usuario con exito",
        response: true,
        token : ''
    }
    let statusCode = 200

    try{

        const token = crypto.randomBytes(32).toString('hex');
        const usu = await prisma.usuusuarios.findFirst({
            where : {
                usuusuario : req_usucorreo
            }
        })
        await prisma.usuusuarios.update({
            where : {
                usuid : usu.usuid
            },
            data : {
                usutoken : token
            }
        })

        jsonResponse = {...jsonResponse, token : token}
        
    }catch(err){
        console.log(err)
        statusCode = 500
        jsonResponse = {...jsonResponse, message : 'Ha ocurrido un error al logear al usuario', response : false}
    }finally{
        res.status(statusCode)
        .json(jsonResponse)
    }
}

module.exports = controller