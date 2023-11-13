const controller = {}
const { PrismaClient } = require('@prisma/client')
const { response } = require('express')
const prisma = new PrismaClient()

controller.MetGetNextJourney = async (req, res) => {


    let jsonResponse = {
        message : "Se obtuvo el pais con exito",
        response: true,
    }
    let statusCode = 200
    let data = []

    try{

        const fec = await prisma.fecfechas.findFirst({
            where : {
                fecactual : true
            }
        })


        data = await prisma.parpartidos.findMany({
            where : {
                fecid : fec.fecid
            },
            select : {
                partid : true,
                parlocal : true,
                parvisitante : true,
                parhabilitado : true,
                parfinalizado : true,
                pargoleslocal : true,
                pargolesvisitante : true,
                partlocal : {
                    select : {
                        painombre : true,
                        paiimagen : true
                    }
                },
                fecfechas : {
                    select : {
                        fecjornada : true
                    }
                },
                partvisitante : {
                    select : {
                        painombre : true,
                        paiimagen : true,
                    }
                }
            }
        })
        
        jsonResponse = {...jsonResponse, data : data }

    }catch(err){
        console.log(err)
        statusCode = 500
        jsonResponse = {...jsonResponse, response : false, message : "Ha ocurrido un error al obtener la siguiente jornada"}
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
            .json(jsonResponse).end()
    }
}

module.exports = controller