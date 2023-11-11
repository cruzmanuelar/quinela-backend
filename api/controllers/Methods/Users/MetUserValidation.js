const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetUserValidation = async (req, res) => {

    const { 
        usutoken
    } = req.headers

    let statusCode = 200
    let jsonResponse = {
        response : true,
        message : "Usuario validado con exito"
    }

    try{

        const usu = await prisma.usuusuarios.findFirst({
            where : {
                usutoken : usutoken.replace(/['"]+/g, '')
            }
        })

        if(!usu){
            jsonResponse = {...jsonResponse, response : false, message : "Ha ocurrido un error al validar al usuario"}
        }
    }catch(err){
        console.log(err)
        jsonResponse = {...jsonResponse, response : false, message : "Ha ocurrido un error al validar al usuario"}
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
        .json(jsonResponse).end()
    }
}

module.exports = controller