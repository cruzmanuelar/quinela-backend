const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetPredictionsMatch = async (req, res) => {

    const {
        req_id
    } = req.body

    try{

        let predictions = await prisma.pruprediccionusuarios.findMany({
            where : {
                partid : req_id
            },
            select : {
                parpartidos : {
                    select : {
                        parresultado : true,
                        parfinalizado : true,
                        parlocal : true,
                        parvisitante : true
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

        predictions.map(pre => {

            if(pre.parpartidos.parresultado == pre.parpartidos.parlocal){
                pre.parpartidos.parresultado = 1    
            }else if(pre.parpartidos.parresultado == pre.parpartidos.parvisitante){
                pre.parpartidos.parresultado = 2
            }else{
                pre.parpartidos.parresultado = null
            }
        })

        await prisma.$disconnect()
        res.status(200)
        .json({
            message : 'Se han obtenido las predicciones con exito',
            response: true,
            data : predictions
        }).end()

    }catch(err){
        await prisma.$disconnect()
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener las predicciones del partido',
                response: false
            }).end()
    }
}

module.exports = controller