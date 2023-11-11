const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetDisableMatch = async (req, res) => {

    const {
        req_partid,
        req_status
    } = req.body

    const {
        reqtoken
    } = req.headers

    let jsonResponse = {
        message : `El partido se ${req_status ? "habilito" : "desahabilito"} con exito`,
        response: true,
    }
    let statusCode = 200

    try{

        const usu = await prisma.usuusuarios.findFirst({
            where : {
                usutoken : reqtoken.replace(/['"]+/g, '')
            }
        })

        if(usu.usuid == 10 || usu.usuid == 11){
            const matchDisable = await prisma.parpartidos.update({
                where : {
                    partid : req_partid
                },
                data : {
                    parhabilitado : req_status
                }
            })
        }else{
            jsonResponse = {...jsonResponse, response : false, message : "El usuario no tiene permisos"}
        }
    }catch(err){
        console.log(err)
        jsonResponse = {...jsonResponse, response : false, message : "Ha ocurrido un error al actualizar el partido"}
    }finally{
        res.status(statusCode)
        .json(jsonResponse).end()
    }
}

module.exports = controller