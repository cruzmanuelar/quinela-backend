const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetPrevMatches = async (req, res) => {

    const {
        reqtoken
    } = req.headers
    
    let jsonResponse = {
        message : "Se obtuvieron los partidos con exito",
        response: true,
    }
    let statusCode = 200

    try{

        let fecPrevMatch
        let prevMatches = []

        const reqTokenUsu = reqtoken
        const user = await prisma.usuusuarios.findFirst({
            where : {
                usutoken : reqTokenUsu.slice(1, -1)
            }
        })

        const currentFec = await prisma.fecfechas.findFirst({
            where : {
                fecactual : true
            }
        })

        fecPrevMatch = await prisma.parpartidos.findFirst({
            where : {
                fecid : {
                    lt : currentFec.fecid
                }
            },
            orderBy : {
                fecid : 'desc'
            }
        })

        if(fecPrevMatch){
            prevMatches = await prisma.parpartidos.findMany({
                where : {
                    fecid : fecPrevMatch.fecid
                },
                select : {
                    partid : true,
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
                            paiimagen : true
                        }
                    },
                    pargoleslocal : true,
                    pargolesvisitante : true
                }
            })

            for await(const prevm of prevMatches){

                const predictionUser = await prisma.pruprediccionusuarios.findFirst({
                    where : {
                        usuid : user.usuid,
                        partid : prevm.partid
                    }
                })
    
                if(predictionUser){
                    prevm['predictionLocal'] = predictionUser.prugoleslocal
                    prevm['predictionVisitante'] = predictionUser.prugolesvisitante
                }
            }
        }

        jsonResponse = {...jsonResponse,
            data : {
                prevMatches
            },
        }
        
    }catch(err){
        console.log(err)
        statusCode = 500
        jsonResponse = {...jsonResponse,
            message : "Ha ocurrido un error al obtener los partidos",
            response: false
        }
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
        .json(jsonResponse).end()
    }
}

module.exports = controller