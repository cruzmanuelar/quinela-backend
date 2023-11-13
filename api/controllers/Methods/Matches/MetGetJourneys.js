const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetJourneys = async (req, res) => {

    let statusCode = 500
    let jsonResponse = {
        response : true,
        message : "Se han obtenido las jornadas con exito"
    }
    let data = []

    try{

        const fecs = await prisma.fecfechas.findMany({})

        fecs.map(fec => {
            data.push({
                active : fec.fecactual ? true : false,
                value : fec.fecid,
                label : "Jornada " + fec.fecjornada + " - " + fec.fecmesnombre + " " + fec.fecanionombre
            })
        })

        jsonResponse = {...jsonResponse, data : data }
        
    }catch(err){
        console.log(err)
        statusCode = 500
        jsonResponse = {...jsonResponse, response : false, message : "Ha ocurrido un error al obtener las jornadas"}
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
            .json(jsonResponse).end()
    }
}

module.exports = controller