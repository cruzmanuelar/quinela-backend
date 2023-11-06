const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetPredictionsMatch = async (req, res) => {

    const {
        req_id
    } = req.body

    try{

        const predictions = await prisma.pruprediccionusuarios.findMany({
            where : {
                partid : req_id
            },
            select : {
                parpartidos : {
                    select : {
                        parresultado : true
                    }
                },
                usuusuarios : {
                    select : {
                        usuusuario : true
                    }
                },
                pruresultado : true,
                prugoleslocal : true,
                prugolesvisitante : true
            }
        })

        res.status(200)
        .json({
            message : 'Se han obtenido las predicciones con exito',
            response: true,
            data : predictions
        }).end()

    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener las predicciones del partido',
                response: false
            }).end()
    }
}

module.exports = controller