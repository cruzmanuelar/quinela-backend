const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetAllMatches = async (req, res) => {

    try{

        let data = []

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

        for await (mat of data){
            const fec = await prisma.fecfechas.findFirst({
                where : {
                    fecid : mat.journey
                }
            })

            mat['description'] = fec.fecmesnombre.substring(0, 3) + " " + fec.fecanio 
        }
        await prisma.$disconnect()
        res.status(200)
            .json({
                message : 'Ha ocurrido un error al obtener los partidos',
                response: true,
                data
            })
        
    }catch(err){
        await prisma.$disconnect()
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener los partidos',
                response: false
            }).end()
    }
}

module.exports = controller