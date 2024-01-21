const Discord = require("discord.js")
const Client = new Discord.Client({intents:["Guilds","GuildMembers","MessageContent","GuildMessages"]})
const prefix = "!"
const fs = require("fs")

Client.on("ready", () => console.log("I am not ok"))

Client.on("messageCreate",async (msg) => {
    if(msg.author.bot || !msg.content.startsWith(prefix))return

    const args = msg.content.split(" ")
    const command = args.shift().replace("!","")
    if(command == "flappybird"){
        const PEmoji = "<:flappybird:1058788908344815738>"
        const BEmoji = "🟦"
        const PiEmoji = "<:pipe:1058781702421495888>"
		const PiEndTEmoji = "<:pipeEndT:1058783769915564132>"
		const PiEndBEmoji = "<:pipeEndB:1058778552310448228>"
		const CEmoji = "<:cloud:1058793443045949530>"
        var points = 0
        var tillPipe = 5
        var stoped = false
		function CreatePlayer(places){
			/**
			 * @param {Array} places
			*/
			let p = places.filter(place => place.name.split("")[1] == "1")
            let player = p[Math.floor(Math.random() * p.length)]
			player.emoji = PEmoji
			player.active = true
		}
        function CreatePipe(places){
			/**
			 * @param {Array} places
			*/
			let p = places.filter(place => place.name.split("")[1] == "8")
            for(let i =0;i<p.length;i++){
                p[i].emoji = PiEmoji
                p[i].pipe = true
            }
            let odd = p[Math.floor(Math.random() * p.length)]
			odd.emoji = BEmoji
			odd.pipe = false

			var oddET = null
			var oddEB = null
			if(odd.name.split("")[0] != "a"){
				oddET = places.filter(place => place.name.split("")[0] == abc[abc.indexOf(odd.name.split("")[0])-1] && place.name.split("")[1] == odd.name.split("")[1])[0]
				oddET.emoji = PiEndTEmoji
			}
			if(odd.name.split("")[0] != "h"){
				oddEB = places.filter(place => place.name.split("")[0] == abc[abc.indexOf(odd.name.split("")[0])+1] && place.name.split("")[1] == odd.name.split("")[1])[0]
				oddEB.emoji = PiEndBEmoji
			}
		}
		function CreateClouds(places){
			/**
			 * @param {Array} places
			*/
			for(let i = 0;i<Math.floor(Math.random() * 16);i++){
				let p = places[Math.floor(Math.random() * 16)]
				p.emoji = CEmoji
                p.cloud = true
			}
		}
		/**
		* @param {Number} amount
		*/
		let amount = 8
		let abc = ['a','b','c','d','e','f','g','h']
		let abcs = []
		for(let i = 0; i < amount ; i++){
			abcs.push(abc[i])
		}
		let places = []
		amount++
		abcs.forEach(letter => {
			for(let i = 1; i < amount ; i++){
				places.push({emoji:BEmoji,name:`${letter}${i}`,active:false,pipe:false,cloud:false})
			}
		})
		let description = ''
		CreateClouds(places)
		CreatePlayer(places)
        CreatePipe(places)
		places.forEach(place => {
			if(parseInt(place.name.slice(-1)) === amount - 1){description += `${place.emoji}\n`}else{description += place.emoji}
		})
		const reply = await msg.reply({
			embeds:[
				new Discord.EmbedBuilder()
                .setTitle(`Points: ${points}`)
				.setDescription(`${description}`)
			],
			fetchReply:true,
			components:[
				new Discord.ActionRowBuilder().addComponents([
					new Discord.ButtonBuilder()
					.setCustomId("nothing")
					.setLabel("-")
					.setStyle(2)
					.setDisabled(true),
					new Discord.ButtonBuilder()
					.setCustomId("up")
					.setLabel("⬆")
					.setStyle(1),
					new Discord.ButtonBuilder()
					.setCustomId("nothing1")
					.setLabel("-")
					.setStyle(2)
					.setDisabled(true),
				]),
				new Discord.ActionRowBuilder().addComponents([
					new Discord.ButtonBuilder()
					.setCustomId("nothing2")
					.setLabel("-")
					.setStyle(2)
					.setDisabled(true),
					new Discord.ButtonBuilder()
					.setCustomId("down")
					.setLabel("⬇")
					.setStyle(1),
					new Discord.ButtonBuilder()
					.setCustomId("nothing3")
					.setLabel("-")
					.setStyle(2)
					.setDisabled(true),
				])
			]
		})
        async function Updater(){
            if(stoped == true)return
            setTimeout(()=>{
                let description = ''
                function Checker(places,oldPositions,newPositions){
                    for(let i=0;i<oldPositions.length;i++){
                        oldPositions[i].pipe = false
                    }
					places.filter(place => place.cloud == true).forEach(place => {
						place.emoji = CEmoji
					})
                    places.filter(place => place.active === false).forEach(place => {
                        if(place.pipe === true || place.cloud == true)return
                        place.emoji = BEmoji
                    })
                    for(let i=0;i<newPositions.length;i++){
                        newPositions[i].pipe = true
                        newPositions[i].emoji = PiEmoji
                    }
					var pipes = []
					if(newPositions.filter(p => p.name.split("")[1] != newPositions[0].name.split("")[1]).length > 0){
						pipes.push(newPositions.filter(p => p.name.split("")[1] != newPositions[0].name.split("")[1]))
					}
					pipes.push(newPositions.filter(p => p.name.split("")[1] == newPositions[0].name.split("")[1]))
					for(let x = 0;x<pipes.length;x++){
						var odd = places.filter(place => place.name.split("")[1] == pipes[x][0].name.split("")[1] && place.pipe == false)[0]
						if(odd.name.split("")[0] != "a"){
							var oddET = places.filter(place => place.name.split("")[0] == abc[abc.indexOf(odd.name.split("")[0])-1] && place.name.split("")[1] == odd.name.split("")[1])[0]
							oddET.emoji = PiEndTEmoji
						}
						if(odd.name.split("")[0] != "h"){
							var oddEB = places.filter(place => place.name.split("")[0] == abc[abc.indexOf(odd.name.split("")[0])+1] && place.name.split("")[1] == odd.name.split("")[1])[0]
							oddEB.emoji = PiEndBEmoji
						}
					}
                    tillPipe-=1
                    if(tillPipe <= 0){
                        tillPipe+=5
                        CreatePipe(places)
                    }
                    if(newPositions.filter(p => p.name == places.filter(place => place.active == true)[0].name).length > 0) stoped = true
                    if(newPositions.filter(p => p.name.split("")[1] == "1").length > 0){
                        points+=1
                        for(let i=0;i<newPositions.filter(p => p.name.split("")[1] == "1").length;i++){
                            newPositions.filter(p => p.name.split("")[1] == "1")[i].pipe = false
                            newPositions.filter(p => p.name.split("")[1] == "1")[i].emoji = BEmoji
                        }
                    }
                    places.forEach(place => {
                        if(parseInt(place.name.slice(-1)) === amount - 1){description += `${place.emoji}\n`}else{description += place.emoji}
                    })
                    if(stoped == true){
						const sc = require("./scores.json")
                        reply.edit({
                            embeds:[
                                new Discord.EmbedBuilder()
                                .setTitle(`Game over | Ended with ${points} point(s)`)
                                .setDescription(`${description}`)
                            ]
                        }) 
						if(sc.filter(s => s.id == msg.author.id).length <= 0){
							var scores = {id:msg.author.id,score:points}
							const scoresJson = JSON.stringify(scores);
							fs.writeFileSync('scores.json', scoresJson);
						}
						else if(sc.filter(s => s.id == msg.author.id)[0].score < points){
							var scores = {id:msg.author.id,score:points}
							const scoresJson = JSON.stringify(scores);
							fs.appendFileSync('scores.json', scoresJson);
						}
                        return
                    }
                    reply.edit({
                        embeds:[
                            new Discord.EmbedBuilder()
                            .setTitle(`Points: ${points}`)
                            .setDescription(`${description}`)
                        ]
                    })
                    Updater()
                }
                function DecideMovement(places,oldPositions,moveablePlaces){
                    const newPositions = []
                    for(let i = 0;i<moveablePlaces.length;i++){
                        newPositions.push(places.filter(place=>place.name == moveablePlaces[i][0].name)[0])
                    }
                    Checker(places,oldPositions,newPositions)
                }
                function GetMoveablePlaces(places,positions){
                    let moveablePlaces = []
                    for(let i =0;i<positions.length;i++){
                        var position = positions[i]
                        if(Number(position.name.split("")[1]) != 1){
                            moveablePlaces.push(places.filter(place => place.name === `${position.name.slice(0,1)}${Number(position.name.slice(1)) - 1}`))
                        }
                    }
                    if(moveablePlaces.length <= 0)return
                    DecideMovement(places,positions,moveablePlaces)
                }
                function getPosition(places){
                    const positions = places.filter(place => place.pipe === true)
                    GetMoveablePlaces(places,positions)
                }
                getPosition(places)
            },1000*2)
        }
        Updater()
		const filter = inter => inter.user.id === msg.author.id
		const collector = reply.createMessageComponentCollector({filter})
		collector.on("collect", c => {
			let description = ''
			function Checker(places,oldPosition,newPosition){
				oldPosition.active = false
				places.filter(place => place.active === false).forEach(place => {
                    if(place.pipe === true || place.cloud == true)return
                    place.emoji = BEmoji
                })
				newPosition.active = true
				newPosition.emoji = PEmoji
				places.forEach(place => {
					if(parseInt(place.name.slice(-1)) === amount - 1){description += `${place.emoji}\n`}else{description += place.emoji}
				})
				c.update({
					embeds:[
						new Discord.EmbedBuilder()
                        .setTitle(`Points: ${points}`)
						.setDescription(`${description}`)
					]
				})
			}
			function DecideMovement(places,oldPosition,moveablePlaces){
				const picked = moveablePlaces[Math.floor(Math.random() * moveablePlaces.length)]
				const newPosition = places.filter(place => place === picked[0])[0]
				Checker(places,oldPosition,newPosition,)
			}
			function GetMoveablePlaces(places,position,iName){
				let moveablePlaces = []
				moved = ' '
				if(position.name.slice(0,1) != "a" && iName === "up"){
                    moveablePlaces.push(places.filter(place => place.name === `${abc[abc.indexOf(position.name.split("")[0])-1]}${position.name.split("")[1]}`))
				}
				if(position.name.slice(0,1) != places[places.length - 1].name.slice(0,1) && iName === "down"){
					moveablePlaces.push(places.filter(place => place.name === `${abc[abc.indexOf(position.name.split("")[0])+1]}${position.name.split("")[1]}`))
				}
				if(moveablePlaces.length <= 0)return
				DecideMovement(places,position,moveablePlaces)
			}
			function getPosition(places,iName){
				const position = places.filter(place => place.active === true)[0]
				GetMoveablePlaces(places,position,iName)
			}
			getPosition(places,c.customId)
		})
    }
	if(command == "leaderboard"){
		const sc = require("./scores.json")
		let scores = sc
		scores.sort((a, b) => b.score - a.score);
		
		var description = ""
		for (const [i, score] of scores.slice(0, 10).entries()) {
			description += `${i+1}. <@${score.id}> ${score.score} points\n`
		}
		msg.reply({embeds:[
			new Discord.EmbedBuilder()
			.setColor('#0099ff')
  			.setTitle('Leaderboard')
			.setDescription(description)
		]})
	}
})
Client.login(require("./config.json").token)