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

        let matches = await prisma.parpartidos.findMany({
            where : {
                parfinalizado : true
            },
            include : {
                partlocal : true,
                partvisitante : true
            }
        })

        for await(const team of allTeams){

            let lastMatches = []
            
            const nextGame = await prisma.parpartidos.findFirst({
                where : {
                    parfinalizado : false,
                    OR : [
                        {
                            parlocal : team.paiid
                        },
                        {
                            parvisitante : team.paiid
                        }
                    ]
                },
                include : {
                    partlocal : true,
                    partvisitante : true
                }
            })

            let matchesSelection = matches.filter(mat => mat.parlocal == team.paiid || mat.parvisitante == team.paiid) 

            matchesSelection.map(mat => {
                let infoMatch = mat.partlocal.painombre + " " + mat.pargoleslocal + " - " + mat.pargolesvisitante + " " + mat.partvisitante.painombre 

                if(mat.parresultado == null){
                    lastMatches.unshift({info:"draw", class:"Draw-Game", infoMatch})
                }else if(mat.parresultado == team.paiid){
                    lastMatches.unshift({info:"win", class:"Win-Game", infoMatch})
                }else{
                    lastMatches.unshift({info:"lost", class:"Lost-Game", infoMatch})
                }
            })

            if(nextGame){
                let infoMatch = nextGame.partlocal.painombre + " - " + nextGame.partvisitante.painombre
                lastMatches.unshift({info:"Next", class:"Next-Game", infoMatch})
            }

            team["lastMatches"] = lastMatches
            team["pj"] = matchesSelection.length
            team["pg"] = matchesSelection.filter(mat => mat.parresultado == team.paiid).length
            team["pe"] = matchesSelection.filter(mat => mat.parresultado == null).length
            team["pp"] = matchesSelection.length - (team["pg"] + team["pe"])
            let goals = 0
            let goalsRival = 0
            console.log(matchesSelection)

            matchesSelection.forEach(mat => {
                const isLocalTeam = mat.parlocal === team.paiid;
              
                goals += isLocalTeam ? mat.pargoleslocal : mat.pargolesvisitante;
                goalsRival += isLocalTeam ? mat.pargolesvisitante : mat.pargoleslocal;
            })

            team["ptos"] = (team["pg"]*3) + (team["pe"]*1)
            team["gf"] = goals
            team["gc"] = goalsRival
            team["df"] = goals - goalsRival
            if(team["painombre"] == "Ecuador"){
                team["ptos"] = team["ptos"] - 3                
            }
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