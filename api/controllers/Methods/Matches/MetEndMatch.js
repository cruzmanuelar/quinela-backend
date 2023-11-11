const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetEndMatch = async (req, res) => {

    const {
        req_partid,
        req_golLocal,
        req_golVisitante
    } = req.body

    const {
        reqtoken
    } = req.headers

    let jsonResponse = {
        message : "Se marco finalizado el encuentro con exito",
        response: true,
    }
    let statusCode = 200

    try{

        const usu = await prisma.usuusuarios.findFirst({
            where : {
                usutoken : reqtoken.replace(/['"]+/g, '')
            }
        })

        if(usu.usuid == 10 || usu.usuid == 11){
            if(infoMatch.parfinalizado){
                jsonResponse = {...jsonResponse,
                    message : "El partido ya se marco como finalizado anteriormente",
                }
            }else{
    
                let resultMatch = null
                if(req_golLocal != req_golVisitante){
                    resultMatch = req_golLocal > req_golVisitante
                                    ? infoMatch.parlocal
                                    : infoMatch.parvisitante
                }
        
                const match = await prisma.parpartidos.update({
                    where : {
                        partid : req_partid,
                    },
                    data : {
                        parfinalizado : true,
                        pargoleslocal : req_golLocal,
                        pargolesvisitante : req_golVisitante,
                        parresultado : resultMatch
                    }
                })
    
                const responseUpdate = await controller.UpdatePredictionUser(match)
                if(!responseUpdate){
                    jsonResponse = {...jsonResponse,
                        message : 'Ha ocurrido un error al actualizar los puntajes',
                        response: false
                    }
                    statusCode = 500
                }
            }
        }else{
            jsonResponse = {...jsonResponse, response : false, message : "El usuario no tiene permisos"}
        }

        const infoMatch = await prisma.parpartidos.findFirst({
            where : {
                partid : req_partid
            },
            select : {
                parlocal        : true,
                parvisitante    : true,
                parfinalizado   : true
            }
        })


    }catch(err){
        console.log(err)
        jsonResponse = {...jsonResponse,
            message : 'Ha ocurrido un error al marcar como finalizado el partido',
            response: false
        }
    }finally{
        res.status(statusCode)
            .json(jsonResponse).end()
    }
}

controller.UpdatePredictionUser = async ( match ) => {

    try{

        const users = await prisma.usuusuarios.findMany({
            select : {
                usuid : true
            }
        })
    
        let resultReal = 0
        if(match.parresultado){
            if(match.parlocal == match.parresultado){
                resultReal = 1
            }else{
                resultReal = 2
            }    
        }
    
        for await(usu of users){
    
            let ptosUser = 0
            let ptosResult = 0
            let ptosScore = 0
            let ptosGoals = 0
    
            const existData = await prisma.puupuntosusuarios.findFirst({
                where : {
                    fecid   : match.fecid,
                    usuid   : usu.usuid
                }
            })

            const predictionUser = await prisma.pruprediccionusuarios.findFirst({
                where : {
                    usuid : usu.usuid,
                    partid : match.partid
                }
            })

            if(predictionUser){
                if(resultReal == predictionUser.pruresultado){
                    ptosResult = ptosResult + 3
                }
        
                if(match.pargoleslocal == predictionUser.prugoleslocal && match.pargolesvisitante == predictionUser.prugolesvisitante){
                    ptosScore = ptosScore + 2
                }
        
                if(match.pargoleslocal == predictionUser.prugoleslocal){
                    ptosGoals = ptosGoals + 1
                }
        
        
                if(match.pargolesvisitante == predictionUser.prugolesvisitante){
                    ptosGoals = ptosGoals + 1
                }

                ptosUser = ptosGoals + ptosScore + ptosResult
            }else{
                
            }
    
            if(existData){
                await prisma.puupuntosusuarios.update({
                    where : {
                        puuid : existData.puuid
                    },
                    data : {
                        puupuntosresultado  : {
                            increment : ptosResult
                        },
                        puupuntosmarcador   : {
                            increment : ptosScore
                        },
                        puupuntosgoles      : {
                            increment : ptosGoals
                        },
                        puupuntos           : {
                            increment : ptosUser
                        }
                    }
                })
            }else{
                await prisma.puupuntosusuarios.create({
                    data : {
                        usuid               : usu.usuid,
                        fecid               : match.fecid,
                        puupuntosresultado  : ptosResult,
                        puupuntosmarcador   : ptosScore,
                        puupuntosgoles      : ptosGoals,
                        puupuntos           : ptosUser
                    }
                })    
            }    
        }

        return true
    }catch(err){
        console.log(err)
        console.log("Ha ocurrido un error al actualizar los puntos de usuario")
        return false
    }
}

module.exports = controller