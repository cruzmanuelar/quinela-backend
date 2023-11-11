const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetSelectNextJourney = async (req, res) => {

    const {
        req_id
    } = req.body

    const {
        reqtoken
    } = req.headers

    try{

        let jsonResponse = {
            response : true,
            message : "La jornada siguiente se ha establecido con exito"
        }
        let statusCode = 200

        const usu = await prisma.usuusuarios.findFirst({
            where : {
                usutoken : reqtoken.replace(/['"]+/g, '')
            }
        })

        if(usu.usuid == 10 || usu.usuid == 11){
            await prisma.fecfechas.updateMany({
                where: {
                    NOT: {
                        fecid: parseInt(req_id)
                    }
                },
                data: {
                    fecactual: false
                    }
            });
          
            await prisma.fecfechas.updateMany({
            where: {
                fecid: parseInt(req_id)
            },
            data: {
                fecactual: true
                }
            });

        }else{
            jsonResponse = {...jsonResponse, response : false, message : "El usuario no tiene permisos"}
        }

        await prisma.$disconnect()
        res.status(statusCode)
        .json(jsonResponse).end()

    }catch(err){
        await prisma.$disconnect()
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al establecer la proxima jornada',
                response: false
            }).end()
    }
}

module.exports = controller