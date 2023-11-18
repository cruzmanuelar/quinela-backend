const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetNextPrevMatches = async (req, res) => {

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
        let nextMatches = []

        const currentFec = await prisma.fecfechas.findFirst({
            where : {
                fecactual : true
            }
        })

        const reqTokenUsu = reqtoken
        const user = await prisma.usuusuarios.findFirst({
            where : {
                usutoken : reqTokenUsu.slice(1, -1)
            }
        })

        const fecNextMatch = await prisma.parpartidos.findFirst({
            where : {
                fecid : currentFec.fecid
            },
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

        nextMatches = await prisma.parpartidos.findMany({
            where : {
                fecid : fecNextMatch.fecid
            },
            select : {
                partid : true,
                partlocal : {
                    select : {
                        painombre : true,
                        paiimagen : true,
                        paiid : true
                    }
                },
                parhabilitado : true,
                fecfechas : {
                    select : {
                        fecjornada : true
                    }
                },
                partvisitante : {
                    select : {
                        painombre : true,
                        paiimagen : true,
                        paiid : true
                    }
                },
                pargoleslocal : true,
                pargolesvisitante : true
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

        for await(const nextm of nextMatches){
            const predictionUser = await prisma.pruprediccionusuarios.findFirst({
                where : {
                    usuid : user.usuid,
                    partid : nextm.partid
                }
            })

            if(predictionUser){
                nextm['predictionLocal'] = predictionUser.prugoleslocal
                nextm['predictionVisitante'] = predictionUser.prugolesvisitante
            }
            nextm['done'] = predictionUser ? true : false

            nextm['partlocal']['lastMatches'] = await controller.GetLastMatches(nextm.partlocal.paiid)
            nextm['partvisitante']['lastMatches'] = await controller.GetLastMatches(nextm.partvisitante.paiid)
        }

        jsonResponse = {...jsonResponse,
            data : {
                nextMatches,
                prevMatches
            },
            dataUser : {
                nextMatches,
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

controller.GetLastMatches = async (paiid) => {

    let lastMatches = []
            
    const nextGame = await prisma.parpartidos.findFirst({
        where : {
            parfinalizado : false,
            OR : [
                {
                    parlocal : paiid
                },
                {
                    parvisitante : paiid
                }
            ]
        },
        include : {
            partlocal : true,
            partvisitante : true
        }
    })

    const matches = await prisma.parpartidos.findMany({
        where : {
            OR : [
                {
                    parlocal : paiid
                },
                {
                    parvisitante : paiid
                }
            ],
            parfinalizado : true
        },
        include : {
            partlocal : true,
            partvisitante : true
        }
    })


    matches.map(mat => {
        let infoMatch = mat.partlocal.painombre + " " + mat.pargoleslocal + " - " + mat.pargolesvisitante + " " + mat.partvisitante.painombre 

        if(mat.parresultado == null){
            lastMatches.unshift({info:"draw", class:"Draw-Game", infoMatch})
        }else if(mat.parresultado == paiid){
            lastMatches.unshift({info:"win", class:"Win-Game", infoMatch})
        }else{
            lastMatches.unshift({info:"lost", class:"Lost-Game", infoMatch})
        }
    })

    if(nextGame){
        let infoMatch = nextGame.partlocal.painombre + " - " + nextGame.partvisitante.painombre
        lastMatches.unshift({info:"Next", class:"Next-Game", infoMatch})
    }

    return lastMatches
}

module.exports = controller