const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetGetMatch = async (req, res) => {

    const {
        req_fecid
    } = req.body

    let jsonResponse = {
        message : "Se obtuvo el pais con exito",
        response: true,
        data    : []
    }
    let statusCode = 200


    try{

        const matches = await prisma.parpartidos.findMany({
            where : {
                fecid : req_fecid,
            },
            select : {
                partlocal : {
                    select : {
                        painombre : true
                    }
                },
                partvisitante : {
                    select : {
                        painombre : true
                    }
                },
                pargoleslocal : true,
                pargolesvisitante : true
            }
        })

        jsonResponse = {...jsonResponse, data : matches }
        
    }catch(err){
        console.log(err)
        jsonResponse = {...jsonResponse,
            message : 'Ha ocurrido un error al obtener el partido',
            response: false
        }
    }finally{
        res.status(statusCode)
            .json(jsonResponse).end()
    }
}

module.exports = controller