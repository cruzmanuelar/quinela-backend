const controller = {}
const GetMatchController = require('../../Methods/Matches/MetGetMatch')

controller.ValGetMatch = async (req, res) => {

    try{

        await GetMatchController.MetGetMatch(req,res)
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener el partido',
                response: false
            }).end()
    }
}

module.exports = controller