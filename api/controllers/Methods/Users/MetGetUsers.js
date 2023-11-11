const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetUsers = async (req, res) => {

    let jsonResponse = {
        message : "Se obtuvieron los usuarios con exito",
        response: true,
        data : []
    }
    let statusCode = 200

    try{

        const users = await prisma.usuusuarios.findMany()
        jsonResponse = {...jsonResponse, data : users}
        
    }catch(err){
        statusCode = 500
        jsonResponse = {...jsonResponse, message : "Ha ocurrido un error al obtener a los usuarios", response : false}
        console.log(err)

    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
            .json(jsonResponse)
    }
}

module.exports = controller