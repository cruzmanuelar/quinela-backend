const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetNextJourney = async (req, res) => {

    let matches = []

    try{

        const fec = await prisma.fecfechas.findFirst({
            where : {
                fecactual : true
            }
        })


        matches = await prisma.parpartidos.findMany({
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
        await prisma.$disconnect()
        res.status(200)
        .json({
            message : 'Se han obtenido los partidos con exito',
            response: true,
            data : matches
        }).end()
        
    }catch(err){
        await prisma.$disconnect()
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener la siguiente jornada',
                response: false
            }).end()
    }
}

module.exports = controller