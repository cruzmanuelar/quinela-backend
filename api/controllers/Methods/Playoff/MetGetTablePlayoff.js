const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


controller.MetGetTablePlayOff = async (req, res) => {

    try{

        let allTeams = await prisma.paipaises.findMany({})

        for await(team of allTeams){

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
        res.status(200)
            .json({
                message : 'Se ha obtenido la tabla de posiciones con exito',
                response: true,
                data : allTeams
            }).end()
        
    }catch(err){
        console.log(err)
        res.status(500)
            .json({
                message : 'Ha ocurrido un error al obtener la tabla de posiciones',
                response: false
            }).end()
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