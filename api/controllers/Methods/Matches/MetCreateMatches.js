const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetCreateMatches = async (req, res) => {

    const {
        req_matches,
        req_fecid
    } = req.body

    let jsonResponse = {
        message : "Los partidos se crearon con exito",
        response: true,
    }
    let statusCode = 200

    try{
        
        const existMatches = await prisma.parpartidos.findFirst({
            where : {
                fecid : req_fecid
            }
        })
    
        if(existMatches){
            
            jsonResponse = {...jsonResponse, 
                message : "Los partidos ya estan registrados"}
        }else{
            
            for await ( const match of req_matches){
    
                const man = await prisma.parpartidos.create({
                    data : {
                        parlocal        : match.local,
                        parvisitante    : match.visitante,
                        fecid           : req_fecid
                    }
                }) 
            }
        }
        
    }catch(err){
        console.log(err)
        jsonResponse = {...jsonResponse,
            message : "Ha ocurrido un error al crear los partidos",
            response: false
        }
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
            .json(jsonResponse).end()
    }
}

module.exports = controller