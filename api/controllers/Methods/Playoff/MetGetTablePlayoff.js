const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


controller.MetGetTablePlayOff = async (req, res) => {

    let jsonResponse = {
        message : "Se ha obtenido la tabla de posiciones con exito",
        response: true,
    }
    let statusCode = 200

    try{

        let allTeams = await prisma.paipaises.findMany({})

        for await(const team of allTeams){

            const matches = await prisma.parpartidos.findMany({
                where : {
                    OR : [
                        {
                            parlocal : team.paiid
                        },
                        {
                            parvisitante : team.paiid
                        }
                    ],
                    parfinalizado : true
                }
            })

            team["pj"] = matches.length
            team["pg"] = matches.filter(mat => mat.parresultado == team.paiid).length
            team["pe"] = matches.filter(mat => mat.parresultado == null).length
            team["pp"] = matches.length - (team["pg"] + team["pe"])
            let goals = 0
            let goalsRival = 0
            matches.map(mat => {

                if(mat.parlocal == team.paiid){
                    goals = goals + mat.pargoleslocal
                    goalsRival = goalsRival + mat.pargolesvisitante
                }else{
                    goals = goals + mat.pargolesvisitante                    
                    goalsRival = goalsRival + mat.pargoleslocal
                }
            })
            team["ptos"] = (team["pg"]*3) + (team["pe"]*1)
            team["gf"] = goals
            team["gc"] = goalsRival
            team["df"] = goals - goalsRival
        }

        allTeams = allTeams.sort(sortTablePositions);
        jsonResponse = {...jsonResponse, data : allTeams }        
        
    }catch(err){
        console.log(err)
        statusCode = 500
        jsonResponse = {...jsonResponse, response :false, message : "Ha ocurrido un error al obtener la tabla de posiciones" }
    }finally{
        await prisma.$disconnect()
        res.status(statusCode)
            .json(jsonResponse).end()
    }
}

function sortTablePositions(a, b){
    if (a.ptos > b.ptos) {
        return -1;
    } else if (a.ptos < b.ptos) {
        return 1;
    } else {
        if (a.df  > b.df ) {
            return -1;
        } else if (a.df  < b.df ) {
            return 1;
        } else {
            if (a.gf > b.gf) {
                return -1;
            } else if (a.gf < b.gf) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}

module.exports = controller