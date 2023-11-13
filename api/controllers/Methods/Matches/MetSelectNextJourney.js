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

    let jsonResponse = {
        response : true,
        message : "La jornada siguiente se ha establecido con exito"
    }
    let statusCode = 200

    try{

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
    }catch(err){
        console.log(err)
        statusCode = 500
        jsonResponse = {...jsonResponse, response : false, message : "Ha ocurrido un error al establecer la proxima jornada"}
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
        .json(jsonResponse).end()
    }
}

module.exports = controller