const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


controller.MetCreateQuinela = async (req, res) => {

    const {
        reqtoken
    } = req.headers

    const {
        req_data
    } = req.body
    
    let jsonResponse = {
        message : "Se ha registrado la quinela con exito",
        response: true,
        data    : []
    }
    let statusCode = 200

    try{

        const reqTokenUsu = reqtoken
        const user = await prisma.usuusuarios.findFirst({
            where : {
                usutoken : reqTokenUsu.slice(1, -1)
            }
        })

        for await(const data of req_data){

            const existQuinela = await prisma.pruprediccionusuarios.findFirst({
                where : {
                    partid : data.partid,
                    usuid : user.usuid
                }
            })

            let result = null
            if(data.predictionLocal != data.predictionVisitante){
                if(data.predictionLocal > data.predictionVisitante){
                    result = 1
                }else{
                    result = 2
                }
            }
            

            if(existQuinela){

                await prisma.pruprediccionusuarios.update({
                    where : {
                        pruid : existQuinela.pruid
                    },
                    data : {
                        prugoleslocal : data.predictionLocal,
                        prugolesvisitante : data.predictionVisitante,
                        pruresultado : result
                    }
                })
            }else{
                await prisma.pruprediccionusuarios.create({
                    data : {
                        usuid : user.usuid,
                        partid : data.partid,
                        prugoleslocal : data.predictionLocal,
                        prugolesvisitante : data.predictionVisitante,
                        pruresultado : result
                    }
                })
            }
        }

    }catch(err){
        console.log(err)
        jsonResponse = {...jsonResponse,
            message : "Ha ocurrido un error al registrar la quinela",
            response: false
        }
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
        .json(jsonResponse).end()
    }
}

module.exports = controller