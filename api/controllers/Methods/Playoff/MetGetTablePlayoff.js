const controller = {}

controller.MetGetTablePlayOff = async (req, res) => {

    try{

        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener la tabla de posiciones',
                response: false
            }).end()
    }
}

module.exports = controller