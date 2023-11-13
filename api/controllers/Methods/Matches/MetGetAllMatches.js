const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetAllMatches = async (req, res) => {

    let jsonResponse = {
        message : "Los partidos se obtuvieron con exito",
        response: true,
    }
    let statusCode = 200
    let data = []

    try{

        const matches = await prisma.parpartidos.findMany({
            select : {
                partid : true,
                fecid : true,
                parfinalizado : true,
                partlocal : {
                    select : {
                        painombre : true,
                        paiimagen : true
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

        let journey = 1
        matches.map(mat => {
            let findJourney = data.findIndex(jou => jou.journey == journey)

            if(findJourney != -1){
                data[findJourney]['data'].push(mat)
                if(data[findJourney]['data'].length == 5){
                    journey = journey + 1
                }
            }else{
                data.push({
                    title : "Jornada " + journey,
                    journey : journey,
                    data : [
                        mat
                    ]
                })
            }
        })

        for await (const mat of data){
            const fec = await prisma.fecfechas.findFirst({
                where : {
                    fecid : mat.journey
                }
            })

            mat['description'] = fec.fecmesnombre.substring(0, 3) + " " + fec.fecanio 
        }

        jsonResponse = {...jsonResponse, data : data }
        
    }catch(err){
        console.log(err)
        statusCode = 500
        jsonResponse = {...jsonResponse, response : false, message : "Ha ocurrido un error al obtener los partidos"}
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
            .json(jsonResponse).end()
    }
}

module.exports = controller