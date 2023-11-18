const controller = {}
const { PrismaClient } = require('@prisma/client')
const { response } = require('express')
const prisma = new PrismaClient()

controller.MetGetPredictionsMatch = async (req, res) => {

    const {
        req_id
    } = req.body

    let jsonResponse = {
        message : "Se han obtenido las predicciones con exito",
        response: true,
    }
    let statusCode = 200

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
                        parvisitante : true,
                        pargoleslocal : true,
                        pargolesvisitante : true
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

            pre["onFire"] = pre.parpartidos.pargoleslocal == pre.prugoleslocal && pre.parpartidos.pargolesvisitante == pre.prugolesvisitante
        })

        jsonResponse = {...jsonResponse, data : predictions }
    }catch(err){
        console.log(err)
        statusCode = 500
        jsonResponse = {...jsonResponse, message : "Ha ocurrido un error al obtener las predicciones del partido",
        response: false}
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
            .json(jsonResponse).end()
    }
}

module.exports = controller