const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


controller.MetGetScoreUsers = async (req, res) => {

    
    let jsonResponse = {
        message : "Se obtuvieron la tabla de posiciones con exito",
        response: true,
        data : []
    }
    let statusCode = 200

    try{

        let data = []

        const positions = await prisma.puupuntosusuarios.groupBy({
            by: ['usuid'],
            _sum: {
                puupuntosresultado  : true,
                puupuntosmarcador   : true,
                puupuntosgoles      : true,
                puupuntos           : true
            },
        })

        let index = 1
        for await(const pos of positions){
            const user = await prisma.usuusuarios.findFirst({
                where : {
                    usuid : pos.usuid
                }
            })

            data.push({
                key : index,
                user: user.usuusuario,
                ptosResult: pos._sum.puupuntosresultado,
                ptosScore : pos._sum.puupuntosmarcador,
                ptosGoals : pos._sum.puupuntosgoles,
                ptosTotal : pos._sum.puupuntos,
            })
            index = index + 1
        }
    

        jsonResponse = {...jsonResponse, data : data}
        
    }catch(err){
        console.log(err)
        statusCode = 500
        jsonResponse = {...jsonResponse, message : 'Ha ocurrido un error al obtener la tabla de posiciones', response : false}
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
        .json(jsonResponse).end()
    }
}

module.exports = controller