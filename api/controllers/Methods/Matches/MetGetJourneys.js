const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetJourneys = async (req, res) => {

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


        res.status(200)
            .json({
                message : 'Se han obtenido las jornadas con exitos',
                response: true,
                data
            }).end()
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener las jornadas',
                response: false
            }).end()
    }
}

module.exports = controller