const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetUpdatePoints = async (req, res) => {

    let jsonResponse = {
        response : true,
        message : "Se han actualizado los puntajes con exito"
    }
    let statusCode = 200

    try{

        await prisma.puupuntosusuarios.deleteMany({})

        const fecs = await prisma.fecfechas.findMany({})
        const usus = await prisma.usuusuarios.findMany({})

        //Jornada X
        for await(const fec of fecs){
            const parts = await prisma.parpartidos.findMany({
                where : {
                    fecid : fec.fecid,
                    parfinalizado : true
                }
            })

            //Para el usuario Y, Z y Jornada X
            for await(const usu of usus){

                let ptosResult = 0
                let ptosGoals = 0
                let ptosGoalsExact = 0

                //Recorremos todos los partidos de la Jornada X
                for await(const part of parts){

                    //Buscamos la prediccion de ese usuario para ese partido
                    const pruUsu = await prisma.pruprediccionusuarios.findFirst({
                        where : {
                            partid : part.partid,
                            usuid : usu.usuid
                        }
                    })

                    let teamWinner = null
                    if(part.parlocal == part.parresultado){
                        teamWinner = 1
                    }else if(part.parvisitante == part.parresultado){
                        teamWinner = 2
                    }

                    if(pruUsu){

                        if(pruUsu.pruresultado == teamWinner){
                            ptosResult = ptosResult + 3
                        }

                        if(part.pargoleslocal == pruUsu.prugoleslocal && part.pargolesvisitante == pruUsu.prugolesvisitante){
                            ptosGoalsExact = ptosGoalsExact + 2
                        }

                        if(part.pargoleslocal == pruUsu.prugoleslocal){
                            ptosGoals = ptosGoals + 1
                        }

                        if(part.pargolesvisitante == pruUsu.prugolesvisitante){
                            ptosGoals = ptosGoals + 1
                        }

                    }
                }
                let ptosTotal = ptosResult + ptosGoalsExact + ptosGoals
                await prisma.puupuntosusuarios.create({
                    data : {
                        usuid : usu.usuid,
                        fecid : fec.fecid,
                        puupuntosresultado : ptosResult,
                        puupuntosmarcador : ptosGoalsExact,
                        puupuntosgoles : ptosGoals,
                        puupuntos : ptosTotal
                    }
                })
            }
        }

    }catch(err){
        console.log(err)
        statusCode = 500
        jsonResponse = {...jsonResponse, response: false, message : "Ha ocurrido un error al actualizar los puntajes"}
    }finally{
        res.status(statusCode)
            .json(jsonResponse).end()
        
    }
}

module.exports = controller