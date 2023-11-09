const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetSelectNextJourney = async (req, res) => {

    const {
        req_id
    } = req.body

    try{

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

        res.status(200)
        .json({
            message : 'La jornada siguiente se ha establecido con exito',
            response: true
        }).end()
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al establecer la proxima jornada',
                response: false
            }).end()
    }
}

module.exports = controller